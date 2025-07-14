import os
import uuid

import aiofiles
import server
from aiohttp import web
from lumi_batcher_service.common.error import getErrorResponse
from lumi_batcher_service.common.file import (
    find_comfyui_dir,
)
from lumi_batcher_service.common.validate_prompt import handle_validate_prompt


class CommonHandler:
    instance = None
    api_prefix = "/api/comfyui-lumi-batcher"

    def __init__(self):
        def getApiPath(path):
            return "{}{}".format(self.api_prefix, path)

        @server.PromptServer.instance.routes.post(getApiPath("/workflow-validate"))
        async def workflow_validate(request):
            resp_code = 200
            json_data = await request.json()
            # 解析请求参数
            prompt = json_data["prompt"]
            workflow = json_data["workflow"]
            client_id = json_data["client_id"]
            number = None
            if "number" in json_data:
                number = float(json_data["number"])

            queue_request_body = {
                "client_id": client_id,
                "prompt": prompt,
                "extra_data": {"extra_pnginfo": {"workflow": workflow}},
            }

            if number == -1:
                queue_request_body["front"] = True
            elif number is not None:
                queue_request_body["number"] = number

            json_data = server.PromptServer.instance.trigger_on_prompt(
                queue_request_body
            )

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
                    return web.json_response(
                        {
                            "prompt": prompt,
                            "number": number,
                            "extra_data": extra_data,
                        },
                        status=resp_code,
                    )
                else:
                    return web.json_response(
                        {"error": valid[1], "node_errors": valid[3]}, status=400
                    )
            else:
                return web.json_response(
                    {"error": "no prompt", "node_errors": []}, status=400
                )

        @server.PromptServer.instance.routes.post(getApiPath("/upload-file"))
        async def uploadFile(request):
            try:
                reader = await request.multipart()
                field = await reader.next()

                if field.name == "file":
                    # 获取上传文件的名称
                    filename = field.filename
                    comfyui_dir = find_comfyui_dir()
                    file_path = os.path.join(
                        comfyui_dir, "input", os.path.basename(filename)
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

                    # 返回文件路径作为响应
                    return web.json_response(
                        {
                            "code": 200,
                            "message": "上传文件成功",
                            "data": {"file_name": filename, "file_size": size},
                        }
                    )

                return web.Response(status=400, text="No file field in POST request")
            except Exception as e:
                return web.json_response(getErrorResponse(e, "上传文件失败"))
