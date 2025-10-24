# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
import copy
import json
import mimetypes
import os
import traceback
import uuid
import aiofiles
import folder_paths
import server
import execution
from aiohttp import web
import itertools
from lumi_batcher_service.common.workspace import WorkSpaceManager
from lumi_batcher_service.dao.batch_task import BatchTaskDao
from lumi_batcher_service.dao.batch_sub_task import (
    BatchSubTaskDao,
    SubTaskActionType,
    SubTaskStatus,
)
from lumi_batcher_service.dao.resources import ResourcesDao
from lumi_batcher_service.constant.task import (
    CommonTaskStatus,
    StatusCounts,
    PackageInfo,
)
from lumi_batcher_service.common.file_path import (
    is_under_delete_white_dir,
    is_under_lumi_batcher,
)

# from lumi_batcher_service.controller.homeless.save_image import getSaveImageConfig
import mimetypes
from urllib.parse import unquote
from lumi_batcher_service.common.file import (
    get_file_absolute_path,
    get_file_info,
)
from lumi_batcher_service.thread.task_scheduler_manager import RunInThread
from lumi_batcher_service.common.error import getErrorResponse
from lumi_batcher_service.common.file import (
    get_file_absolute_path,
)
from lumi_batcher_service.controller.task.cancel_queue import cancel_queue
from lumi_batcher_service.common.resolve_file import resolveFileManager
from lumi_batcher_service.controller.task.update_prompt import (
    updatePrompt,
    generateSimpleConfigDefault,
)
from lumi_batcher_service.controller.task.update_workflow import (
    update_workflow,
)
from lumi_batcher_service.controller.output.nodes import process_output_nodes
from lumi_batcher_service.controller.output.process import process_output
from lumi_batcher_service.common.delete_file import batch_delete_files
from lumi_batcher_service.common.validate_prompt import handle_validate_prompt


class BatchToolsHandler:
    instance = None
    workSpaceManager = WorkSpaceManager("comfyui_lumi_batcher_workspace")
    api_prefix = "/api/comfyui-lumi-batcher"

    resources_path = "resources"
    download_path = "download"
    db_path = "db"
    upload_path = "upload"

    batchTaskDao: BatchTaskDao
    batchSubTaskDao: BatchSubTaskDao
    resourcesDao: ResourcesDao

    batch_tools_db_name = "batch_tools.db"

    def __init__(self):
        # 暴露运行时的当前实例
        BatchToolsHandler.instance = self
        self.customData = {}
        # 添加资源文件夹，未来可以将批量任务涉及的资源统一放到这里
        self.workSpaceManager.addDirectory(self.resources_path)
        # 添加数据存储文件夹，未来可以将数据统一放到这里
        self.workSpaceManager.addDirectory(self.db_path)
        # 添加下载文件夹，未来可以将下载的文件统一放到这里
        self.workSpaceManager.addDirectory(self.download_path)
        # 添加上传文件夹，未来可以将上传的文件统一放到这里
        self.workSpaceManager.addDirectory(self.upload_path)

        db_path = self.workSpaceManager.getFilePath(
            self.db_path, self.batch_tools_db_name
        )

        # 关联本地数据库
        self.batchTaskDao = BatchTaskDao(db_path)
        self.batchSubTaskDao = BatchSubTaskDao(db_path)
        self.resourcesDao = ResourcesDao(db_path)

        # 创建资源上传控制实例
        from lumi_batcher_service.controller.resources.resource import (
            ResourceController,
        )

        self.resourceController = ResourceController(self)

        # 当服务初始化时，我们认定房间触发了重启，更新子任务表中所有未完成的数据
        self.batchSubTaskDao.update_on_reboot_room()
        self.batchTaskDao.update_on_reboot_room()

        def getApiPath(path):
            return "{}{}".format(self.api_prefix, path)

        @server.PromptServer.instance.routes.post(getApiPath("/batch-task/create"))
        async def createBatchTask(request):
            try:
                resp_code = 200
                json_data = await request.json()
                loop = asyncio.get_running_loop()
                # 解析请求参数
                params_config = json_data["params_config"]
                prompt = json_data["prompt"]
                workflow = json_data["workflow"]
                client_id = json_data["client_id"]
                auth_token_comfy_org = json_data["auth_token_comfy_org"]
                api_key_comfy_org = json_data["api_key_comfy_org"]

                number = None
                if "number" in json_data:
                    number = float(json_data["number"])
                task_name = json_data["task_name"]

                # 计算任务叉乘后的任务数量
                queue_count = self.getQueueCount(params_config)

                statusCounts = StatusCounts()
                packageInfo = PackageInfo()

                errorMessages = []

                # 生成唯一id，并写入文件
                batch_task_id = str(uuid.uuid4())

                # 2025.07.02 取消：处理SaveImage节点的配置
                # save_image_config_list = getSaveImageConfig(prompt, batch_task_id)
                # params_config = params_config + save_image_config_list

                params_config_str = json.dumps(params_config)

                # 处理叉乘
                functionRes = await loop.run_in_executor(
                    None, self.generateBatchParams, params_config, prompt, workflow
                )

                final_response = {
                    "code": resp_code,
                    "message": "创建批量任务成功",
                    "data": {"prompt_post_list": [], "cross_product": functionRes},
                }

                self.batchTaskDao.insert_task(
                    batch_task_id,
                    task_name,
                    queue_count,
                    CommonTaskStatus.WAITING.value,
                    params_config_str,
                    statusCounts.to_json(),
                    packageInfo.to_json(),
                    json.dumps(errorMessages),
                    json.dumps(
                        {"output_nodes": process_output_nodes(prompt), "prompt": prompt}
                    ),
                )

                async def process_item(item):
                    if "prompt" in item and "workflow" in item:
                        queue_request_body = {
                            "client_id": client_id,
                            "prompt": item["prompt"],
                            "extra_data": {
                                "auth_token_comfy_org": auth_token_comfy_org,
                                "api_key_comfy_org": api_key_comfy_org,
                                "extra_pnginfo": {"workflow": item["workflow"]},
                            },
                        }

                        params_config_str = json.dumps(
                            item["workflow"].get("ba_batch_tools_prompt_combine", [])
                        )

                        if number == -1:
                            queue_request_body["front"] = True
                        elif number is not None:
                            queue_request_body["number"] = number

                        try:
                            queue_response = await self.post_prompt(queue_request_body)

                            final_response["data"]["prompt_post_list"].append(
                                queue_response
                            )

                            prompt_id = queue_response.get(
                                "prompt_id", str(uuid.uuid4())
                            )
                            error = queue_response.get(
                                "error", "创建任务失败，请检查工作流！"
                            )

                            if "error" in queue_response:
                                self.batchSubTaskDao.insert_task(
                                    batch_task_id,
                                    prompt_id,
                                    params_config_str,
                                    SubTaskStatus.FAILED.value,
                                    json.dumps(error),
                                    json.dumps([]),
                                )
                                # 更新创建失败数量
                                statusCounts.create_failed = (
                                    statusCounts.create_failed + 1
                                )
                                errorMessages.append(error)
                            else:
                                self.batchSubTaskDao.insert_task(
                                    batch_task_id,
                                    prompt_id,
                                    params_config_str,
                                    SubTaskStatus.PENDING.value,
                                    json.dumps(error),
                                    json.dumps([]),
                                )

                        except Exception as e:
                            self.batchSubTaskDao.insert_task(
                                batch_task_id,
                                str(uuid.uuid4()),
                                params_config_str,
                                SubTaskStatus.FAILED.value,
                                json.dumps("创建任务失败，请检查工作流！"),
                                json.dumps([]),
                            )
                            # 更新创建失败数量
                            statusCounts.create_failed = statusCounts.create_failed + 1
                            final_response["data"]["prompt_post_list"].append(e)
                            traceback.print_exc()

                tasks = [process_item(item) for item in functionRes]

                await asyncio.gather(*tasks)

                if statusCounts.create_failed == queue_count:
                    self.batchTaskDao.update_property(batch_task_id, "status", "failed")
                    self.batchTaskDao.update_property(
                        batch_task_id, "messages", json.dumps(errorMessages)
                    )
                elif statusCounts.create_failed > 0:
                    self.batchTaskDao.update_property(
                        batch_task_id, "status_counts", statusCounts.to_json()
                    )

                def dataUploadToRoom():
                    try:
                        self.resourceController.resourceUpload.createUploadTask(
                            batch_task_id, params_config
                        )
                    except Exception as e:
                        print(f"Exception in createFileUpload: {e}")
                        traceback.print_exc()

                RunInThread(dataUploadToRoom)

                return web.json_response(
                    {
                        "code": resp_code,
                        "message": "创建批量任务成功",
                        "data": {"queue_count": queue_count},
                    }
                )
            except Exception as e:
                print("----create batch task error-----", e)
                return web.json_response(getErrorResponse(e, "创建批量任务失败"))

        @server.PromptServer.instance.routes.get(getApiPath("/batch-task/list"))
        async def getTaskList(request):
            try:
                resp_code = 200

                query = request.rel_url.query
                page_size = int(query.get("page_size", 10))
                page_num = int(query.get("page_num", 1))
                name = query.get("name", "")
                status = query.get("status", None)

                data, count = self.batchTaskDao.get_task_list(
                    name, status, page_size, (page_num - 1) * page_size
                )

                # results = [
                #     {**d, "params_config": json.loads(d["params_config"])} for d in data
                # ]

                response = {
                    "code": resp_code,
                    "message": "获取所有历史任务列表成功",
                    "data": {"data": data, "total": count},
                }

                return web.json_response(response)
            except Exception as e:
                return web.json_response(
                    getErrorResponse(e, "获取所有历史任务列表失败")
                )

        @server.PromptServer.instance.routes.get(getApiPath("/batch-task/detail"))
        async def getTaskDetail(request):
            try:
                resp_code = 200
                # 解析请求参数
                query = request.rel_url.query
                batch_task_id = str(query.get("batch_task_id", ""))

                # 读取数据库
                batch_task = self.batchTaskDao.get_task_by_id(batch_task_id)

                if batch_task is None:
                    return web.json_response(
                        getErrorResponse("", "获取任务详情失败, 任务Id不存在")
                    )

                return web.json_response(
                    {
                        "code": resp_code,
                        "message": "获取任务详情成功",
                        "data": {
                            **batch_task,
                            "package_info": json.loads(
                                batch_task.get("package_info", "{}")
                            ),
                            "resources_map": self.resourceController.get_resources_map(
                                batch_task_id
                            ),
                        },
                    }
                )
            except Exception as e:
                return web.json_response(getErrorResponse(e, "获取任务详情失败"))

        @server.PromptServer.instance.routes.post(getApiPath("/batch-task/update-name"))
        async def update_task_name(request):
            try:
                resp_code = 200
                json_data = await request.json()
                # 解析请求参数
                batch_task_id = json_data["batch_task_id"]

                task_name = json_data["name"]

                res = self.batchTaskDao.update_task_name(task_name, batch_task_id)

                if res is None:
                    raise Exception("task name update failed")

                response = {
                    "code": resp_code,
                    "message": "更新任务名称成功",
                    "data": res,
                }

                return web.json_response(response)
            except Exception as e:
                return web.json_response(getErrorResponse(e, "更新任务名称失败"))

        @server.PromptServer.instance.routes.get(
            getApiPath("/download-batch-task-result")
        )
        async def getBatchTaskResultDownload(request):
            try:
                # TODO 提供一个新的接口，入参为任务id，返回文件流
                query = request.rel_url.query
                # 解析请求参数
                batch_task_id = query.get("batch_task_id", "")

                if batch_task_id is None:
                    return web.json_response(
                        getErrorResponse("", "下载压缩包失败, 任务Id不能为空")
                    )

                batch_task = self.batchTaskDao.get_task_by_id(batch_task_id)
                file_name = batch_task.get("name", "results")
                # 可以考虑package_info中直接存可下载路径 + result_id + 状态
                package_info = batch_task.get(
                    "package_info",
                    {"file_path": "", "result_id": "", "status": "success"},
                )

                file_path = package_info.get("file_path", "")
                if file_path == "":
                    return web.json_response(
                        getErrorResponse("", "下载压缩包失败, 压缩包不存在")
                    )
                file_size = os.path.getsize(file_path)
                # 使用aiofiles打开文件进行异步读取
                async with aiofiles.open(file_path, "rb") as f:
                    # 创建响应对象，设置响应头
                    response = web.StreamResponse()
                    response.headers["CONTENT-DISPOSITION"] = (
                        f'attachment; filename="{file_name}.zip"'
                    )
                    response.headers["CONTENT-TYPE"] = "application/octet-stream"
                    response.headers["CONTENT-LENGTH"] = str(file_size)

                    # 准备发送响应
                    await response.prepare(request)

                    # 异步读取文件内容并发送
                    chunk = await f.read(1024)
                    while chunk:
                        await response.write(chunk)
                        chunk = await f.read(1024)

                    # 结束响应
                    await response.write_eof()

                    return response

            except Exception as e:
                return web.json_response(getErrorResponse(e, "下载压缩包失败"))

        @server.PromptServer.instance.routes.get(getApiPath("/batch-task/result"))
        async def getRoomResults(request):
            try:
                resp_code = 200
                # 解析请求参数
                query = request.rel_url.query
                batch_task_id = str(query.get("batch_task_id", ""))

                result = self.batchSubTaskDao.get_result(batch_task_id)

                results = process_output(result)

                response = {
                    "code": resp_code,
                    "message": "获取所有任务结果列表成功",
                    "data": {
                        "results": results,
                        "resourcesMap": self.resourceController.get_resources_map(
                            batch_task_id
                        ),
                    },
                }

                return web.json_response(response)
            except Exception as e:
                return web.json_response(getErrorResponse(e, "获取结果列表失败"))

        @server.PromptServer.instance.routes.get(getApiPath("/view-image"))
        async def view_image(request):
            output_directory = folder_paths.get_output_directory()
            type = request.rel_url.query.get("type", "output")
            file_name = request.rel_url.query.get("file_name")

            # 自动解码已编码的参数
            try:
                file_name = unquote(file_name)
            except:
                file_name = file_name

            file_path = f"{output_directory}/{file_name}"

            if type == "input":
                file_path = f"input/{file_name}"
            elif type == "resource":
                file_path = self.resourceController.get_resource_path(file_name)
            elif type == "download":
                file_path = os.path.join(
                    self.workSpaceManager.getDirectory(self.download_path),
                    file_name,
                )

            if not is_under_delete_white_dir(file_path):
                return web.Response(
                    status=400,
                    text="file path: {} is not in white list".format(file_path),
                )

            # 检查文件是否存在
            if not os.path.exists(file_path):
                new_file_path = get_file_absolute_path(file_path)

                if os.path.exists(new_file_path):
                    file_path = new_file_path
                else:
                    return web.Response(status=404, text="Image not found")

            # 获取文件信息
            file_info = get_file_info(file_path)
            file_type = file_info.get("type")

            # 异步打开文件
            async with aiofiles.open(file_path, "rb") as file:
                file_data = await file.read()
                mime_type, _ = mimetypes.guess_type(file_path)

                headers = {
                    "Cache-Control": "public, max-age=2592000",
                    "Accept-Ranges": "bytes",
                    "Content-Length": str(len(file_data)),
                }

                if file_type == "video":
                    headers.update(
                        {
                            "Content-Disposition": "inline",
                            "X-Content-Type-Options": "nosniff",
                        }
                    )

                # 只通过content_type参数设置MIME类型
                return web.Response(
                    body=file_data,
                    content_type=mime_type,  # 移除了headers中的Content-Type
                    headers=headers,
                )

        @server.PromptServer.instance.routes.post(getApiPath("/batch-task/cancel"))
        async def cancelTask(request):
            try:
                resp_code = 200
                json_data = await request.json()
                # 解析请求参数
                batch_task_id = json_data["batch_task_id"]

                response = {"code": resp_code, "message": "取消任务成功", "data": True}

                self.batchSubTaskDao.execute_action(
                    SubTaskActionType.CANCEL, batch_task_id
                )

                self.batchTaskDao.update_property(
                    batch_task_id, "status", CommonTaskStatus.CANCELLED.value
                )

                await cancel_queue(self.batchSubTaskDao.get_prompt_ids(batch_task_id))

                from lumi_batcher_service.controller.package.package import (
                    execute_package_batch_task,
                )

                asyncio.create_task(execute_package_batch_task(self, batch_task_id))

                return web.json_response(response)
            except Exception as e:
                return web.json_response(getErrorResponse(e, "取消任务失败"))

        @server.PromptServer.instance.routes.post(getApiPath("/batch-task/delete"))
        async def deleteTask(request):
            try:
                resp_code = 200
                json_data = await request.json()
                # 解析请求参数
                batch_task_id = json_data["batch_task_id"]
                output_directory = folder_paths.get_output_directory()

                response = {"code": resp_code, "message": "删除任务成功", "data": True}

                result = self.batchSubTaskDao.get_result(batch_task_id)

                results = process_output(result)

                need_delete_paths: list[str] = []

                for r in results:
                    l = r.get("list", [])
                    for i in l:
                        t = i.get("type", "")
                        v = i.get("value", "")
                        if t == "image" or t == "video":
                            file_path = f"{output_directory}/{v}"
                            # 检查文件是否存在
                            if not os.path.exists(file_path):
                                new_file_path = get_file_absolute_path(file_path)

                                if os.path.exists(new_file_path):
                                    file_path = new_file_path

                            need_delete_paths.append(file_path)

                resourcesMap = self.resourceController.get_resources_map(batch_task_id)

                for r in resourcesMap.values():
                    need_delete_paths.append(
                        self.workSpaceManager.getFilePath(self.resources_path, r)
                    )

                need_delete_paths = list(set(need_delete_paths))

                # 过滤掉不在白名单目录下的路径
                need_delete_paths = [
                    p for p in need_delete_paths if is_under_delete_white_dir(p)
                ]

                # 清除批量任务产生的结果、依赖资源
                await batch_delete_files(need_delete_paths, concurrency=10)
                # 清除批量任务结果压缩包
                self.workSpaceManager.delete_file(
                    os.path.join(
                        self.workSpaceManager.getDirectory(self.download_path),
                        batch_task_id + ".tar",
                    )
                )
                # 清除批量任务
                self.batchTaskDao.delete(batch_task_id)
                # 清除子任务
                self.batchSubTaskDao.delete(batch_task_id)
                # 清除批量任务涉及资源
                self.resourcesDao.delete(batch_task_id)

                return web.json_response(response)
            except Exception as e:
                return web.json_response(getErrorResponse(e, "删除任务失败"))

        @server.PromptServer.instance.routes.post(getApiPath("/resolve-file"))
        async def resolve_file(request):
            try:
                reader = await request.multipart()
                file_extension = ""
                file_path = ""

                while True:
                    field = await reader.next()
                    if not field:
                        break
                    if field.name == "file":
                        # 获取上传文件的名称
                        filename = field.filename
                        # 指定服务器上的保存路径
                        directory = self.workSpaceManager.getDirectory(self.upload_path)
                        file_path = os.path.join(directory, filename)

                        if not is_under_delete_white_dir(file_path):
                            return web.Response(
                                status=400,
                                text="file path: {} is not in white list".format(
                                    file_path
                                ),
                            )

                        size = 0
                        # 异步写入文件
                        async with aiofiles.open(file_path, "wb") as f:
                            while True:
                                chunk = await field.read_chunk()
                                if not chunk:
                                    break
                                size += len(chunk)
                                await f.write(chunk)
                    elif field.name == "file_extension":
                        file_extension = await field.text()

                if file_extension == "":
                    return web.Response(
                        status=400, text="No file_extension field in POST request"
                    )

                # 返回文件路径作为响应
                return web.json_response(
                    {
                        "code": 200,
                        "message": "上传文件成功",
                        "data": resolveFileManager.resolve_file(
                            file_path, file_extension
                        ),
                    }
                )
            except Exception as e:
                return web.json_response(getErrorResponse(e, "上传文件失败"))

        @server.PromptServer.instance.routes.get(getApiPath("/get-static-file"))
        async def get_static_file(request):
            file_path = request.rel_url.query.get("path")  # 从外部传入完整文件路径

            if not file_path:
                return web.Response(status=400, text="Missing path parameter")

            # 安全检查：确保路径在允许的目录范围内
            if not is_under_lumi_batcher(file_path):
                return web.Response(status=403, text="Access denied")

            # 检查文件是否存在
            if not os.path.exists(file_path):
                new_file_path = get_file_absolute_path(file_path)

                if os.path.exists(new_file_path):
                    file_path = new_file_path
                else:
                    return web.Response(status=404, text="File not found")

            # 异步读取文件
            async with aiofiles.open(file_path, "rb") as f:
                file_data = await f.read()

            # 自动检测MIME类型
            mime_type, _ = mimetypes.guess_type(file_path)

            # 设置缓存头
            return web.Response(
                body=file_data,
                headers={
                    "Content-Type": f"{mime_type}; charset=utf-8",
                    # "Cache-Control": "public, max-age=2592000",
                },
            )

        @server.PromptServer.instance.routes.get(getApiPath("/sw.js"))
        async def get_sw_js(request):
            # 获取当前文件的目录
            current_dir = os.path.dirname(os.path.abspath(__file__))
            # 拼接 sw.js 文件的路径
            sw_file_path = os.path.join(current_dir, "sw.js")
            # 读取 sw.js 文件的内容
            try:
                with open(sw_file_path, "r") as f:
                    sw_script = f.read()
                return web.Response(
                    text=sw_script, content_type="application/javascript"
                )
            except FileNotFoundError:
                return web.Response(status=404, text="Service Worker file not found")

    def generateBatchParams(self, params_config, prompt, workflow):
        try:
            resultList = []
            paramsValuesList = []

            def pushParamsValues(index: int, value: dict):
                # 使用条件判断来确保 i 在合理的范围内
                if index >= 0 and index < len(paramsValuesList):
                    paramsValuesList[i].append(
                        {
                            **value,
                        }
                    )
                # 如果 i 不在列表中，则推入一个新的列表
                else:
                    paramsValuesList.append(
                        [
                            {
                                **value,
                            }
                        ]
                    )

            for i, config in enumerate(params_config):
                if "type" in config:
                    type = config["type"]
                    if type == "group":
                        max_item_length = len(
                            max(config["values"], key=lambda x: len(x["values"]))[
                                "values"
                            ]
                        )

                        for cur_ind in range(max_item_length):
                            group_value_config = {"type": "group", "values": []}

                            for subConfig in config["values"]:
                                if cur_ind < len(subConfig["values"]):
                                    group_value_config["values"].append(
                                        {
                                            **subConfig,
                                            "value": subConfig["values"][cur_ind],
                                        }
                                    )
                                else:
                                    # index匹配不上时，默认取第0个
                                    group_value_config["values"].append(
                                        {**subConfig, "value": subConfig["values"][0]}
                                    )

                            pushParamsValues(i, group_value_config)
                    else:
                        for value in config["values"]:
                            pushParamsValues(i, {**config, "value": value})
                else:
                    # TODO: 处理参数错误场景
                    print("Invalid params")

            product = list(itertools.product(*paramsValuesList))

            def getSortedParam(obj):
                if "type" in obj:
                    if obj["type"] == "group":
                        return obj["values"][0]["internal_name"]
                    else:
                        return obj["internal_name"]
                else:
                    return ""

            productSorted = sorted(product, key=getSortedParam)

            for paramsCombine in productSorted:
                temp_prompt = copy.deepcopy(prompt)
                temp_workflow = copy.deepcopy(workflow)
                ba_batch_tools_params_config = generateSimpleConfigDefault(
                    params_config
                )
                for config_item in paramsCombine:
                    updatePrompt(temp_prompt, config_item, ba_batch_tools_params_config)
                    update_workflow(temp_workflow, temp_prompt, config_item)

                resultList.append(
                    {
                        "prompt": temp_prompt,
                        "workflow": {
                            **temp_workflow,
                            "ba_batch_tools_prompt_combine": list(paramsCombine),
                            "ba_batch_tools_params_config": ba_batch_tools_params_config,
                        },
                    }
                )

            # print('----product-----', json.dumps(product))
            # print('----resultList-----', json.dumps(resultList))

            return resultList
        except Exception:
            traceback.print_exc()
            return []

    def getQueueCount(self, params_config):
        count = 1

        if len(params_config) == 0:
            return 0
        else:
            for _, config in enumerate(params_config):
                if "type" in config:
                    type = config["type"]
                    if type == "group":
                        max_item_length = len(
                            max(config["values"], key=lambda x: len(x["values"]))[
                                "values"
                            ]
                        )
                        count *= max_item_length
                    else:
                        count *= len(config["values"])

        return count

    async def post_prompt(self, json_data):
        json_data = server.PromptServer.instance.trigger_on_prompt(json_data)

        if "number" in json_data:
            number = float(json_data["number"])
        else:
            number = server.PromptServer.instance.number
            if "front" in json_data:
                if json_data["front"]:
                    number = -number

            server.PromptServer.instance.number += 1

        if "prompt" in json_data:
            prompt = json_data["prompt"]
            prompt_id = str(uuid.uuid4())
            valid = await handle_validate_prompt(prompt_id, prompt)
            extra_data = {}
            if "extra_data" in json_data:
                extra_data = json_data["extra_data"]

            if "client_id" in json_data:
                extra_data["client_id"] = json_data["client_id"]
            if valid[0]:
                outputs_to_execute = valid[2]
                server.PromptServer.instance.prompt_queue.put(
                    (number, prompt_id, prompt, extra_data, outputs_to_execute)
                )
                response = {
                    "prompt_id": prompt_id,
                    "number": number,
                    "node_errors": valid[3],
                }
                return response
            else:
                return {"error": valid[1], "node_errors": valid[3]}
        else:
            return {"error": "no prompt", "node_errors": []}
