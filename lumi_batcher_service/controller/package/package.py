# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import os
import shutil
import tempfile
import traceback
import folder_paths
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from lumi_batcher_service.controller.output.process import process_output
from lumi_batcher_service.constant.package import PackageStatus
from lumi_batcher_service.common.homeless import get_max_workers
from lumi_batcher_service.constant.task import Category
from lumi_batcher_service.common.file import file_processor, get_file_absolute_path


async def execute_package_batch_task(
    batchToolsHandler: BatchToolsHandler, batchTaskId: str
):
    """
    执行单个批量任务的打包任务
    """
    try:
        loop = asyncio.get_running_loop()

        file_type = "tar"
        file_path = f"{batchTaskId}"
        output_path = os.path.join(
            batchToolsHandler.workSpaceManager.getDirectory(
                batchToolsHandler.download_path
            ),
            file_path,
        )

        batchToolsHandler.batchTaskDao.update_property(
            batchTaskId,
            "package_info",
            json.dumps(
                {
                    "result": "",
                    "status": PackageStatus.PACKAGING.value,
                    "message": "",
                }
            ),
        )

        async def generateZip():
            with tempfile.TemporaryDirectory() as tmp_dir:
                result = batchToolsHandler.batchSubTaskDao.get_result(batchTaskId)
                results = process_output(result)

                await loop.run_in_executor(None, resolve_results, results, tmp_dir)

                def make_tar_archive():
                    shutil.make_archive(output_path, file_type, tmp_dir)

                # 生成压缩包
                await loop.run_in_executor(None, make_tar_archive)

        task = asyncio.create_task(generateZip())

        await task

        status = PackageStatus.PACKAGING.value

        final_path = f"{batchTaskId}.{file_type}"

        if (
            os.path.exists(
                os.path.join(
                    batchToolsHandler.workSpaceManager.getDirectory(
                        batchToolsHandler.download_path
                    ),
                    final_path,
                )
            )
            is True
        ):
            status = PackageStatus.SUCCESS.value
        else:
            status = PackageStatus.FAILED.value

        batchToolsHandler.batchTaskDao.update_property(
            batchTaskId,
            "package_info",
            json.dumps(
                {
                    "result": final_path,
                    "status": status,
                    "message": "",
                }
            ),
        )
    except Exception as e:
        print("打包失败", e)
        batchToolsHandler.batchTaskDao.update_property(
            batchTaskId,
            "package_info",
            json.dumps(
                {
                    "result": file_path,
                    "status": PackageStatus.FAILED.value,
                    "message": "打包失败 {}".format(e),
                }
            ),
        )
        traceback.print_exc()
        pass


def resolve_results(results: list[dict], dir: str):
    """
    解析结果
    """
    img_id_cache = {}
    max_workers = get_max_workers("io")

    print(f"------max workers------: {max_workers}")

    def resolvePath(item: dict, paramsConfig: list[dict]):
        type = item.get("type")
        value = item.get("value")

        configValues: list[str] = []
        for config in paramsConfig:
            if config.get("category", None) != Category.SYSTEM.value:
                t = config.get("type", "")
                if t == "group":
                    for v in config.get("values", []):
                        configValues.append(v.get("value", ""))
                else:
                    configValues.append(config.get("value", ""))

        output_file_name = "_".join(str(x) for x in configValues)
        # 处理文件名中的特殊字符，处理文件路径长度，文件名长度
        output_file_name = file_processor.sanitize_filename(dir, output_file_name)

        if type in ["image", "video"]:
            output_directory = folder_paths.get_output_directory()
            path = os.path.join(output_directory, value)

            if not os.path.isfile(path):
                new_file_path = get_file_absolute_path(path)
                if os.path.exists(new_file_path):
                    path = new_file_path
            if not os.path.isfile(path):
                print(f"File not found: {path}")
            else:
                # 获取文件名
                file_name = os.path.basename(path)
                # 获取文件后缀
                _, file_extension = os.path.splitext(file_name)

                # 新的完整路径
                new_full_path = os.path.join(dir, file_name)

                # 用目录路径+文件名作为唯一标识
                file_name_unique_name = (
                    f"{os.path.join(dir, output_file_name)}{file_extension}"
                )

                temp_full_name = f"{output_file_name}{file_extension}"

                currentCount = img_id_cache.get(file_name_unique_name, 0)

                if currentCount == 0:
                    new_full_path = os.path.join(dir, output_file_name + file_extension)
                else:
                    new_full_path = os.path.join(
                        dir, f"{output_file_name}({currentCount}){file_extension}"
                    )

                img_id_cache[file_name_unique_name] = currentCount + 1

                # 将原始图片或视频拷贝到临时目录
                shutil.copy2(path, new_full_path)
        elif type == "text":
            # 处理文本类的结果
            file_extension = ".txt"
            # 用于判断文件名是否重复时的缓存Key
            file_name_unique_name = f"{output_file_name}{file_extension}"
            temp_full_name = f"{output_file_name}{file_extension}"

            currentCount = img_id_cache.get(file_name_unique_name, 0)

            if currentCount == 0:
                temp_full_name = f"{output_file_name}{file_extension}"
            else:
                temp_full_name = f"{output_file_name}({currentCount}){file_extension}"

            img_id_cache[file_name_unique_name] = currentCount + 1

            file_processor.save_json_array_to_txt(dir, temp_full_name, value)

    # 使用 ThreadPoolExecutor 并行复制文件到临时文件夹
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        for item in results:
            params_config = json.loads(item.get("ParamsConfig", "[]"))

            results_list = item.get("list", [])
            for rl in results_list:
                futures.append(executor.submit(resolvePath, rl, params_config))
        for future in as_completed(futures):
            # 确保所有任务完成
            future.result()
