# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
import json
from .base import BaseThreadController
from ..batch_tools.server import BatchToolsServer
from lib.comfy_patch.batch_tools_patch import (
    batchToolsUtils,
    resolve_outputs_ui,
    resolve_messages,
)
import server


class CheckStatus(BaseThreadController):
    def __init__(self, name):
        super().__init__(name)
        self.setTime(1)

    def execute(self):
        try:
            promptQueue = server.PromptServer.instance.prompt_queue
            queue_running, queue_pending = promptQueue.get_current_queue()

            if len(queue_pending) + len(queue_running) == 0:
                sub_task = batchToolsUtils.get_doing_sub_task()
                prompt_id = ""

                if sub_task is not None:
                    prompt_id = sub_task["prompt_id"]

                if prompt_id == "":
                    self.setTime(10)
                    return
                else:
                    self.setTime(0.001)

                if prompt_id:
                    result = promptQueue.get_history(prompt_id=prompt_id)

                    history = result.get(prompt_id, None)

                    if history != None:
                        outputs_ui = history.get("outputs", {})
                        status = history.get("status", {}).get("status_str", "")
                        messages = history.get("status", {}).get("messages", "")
                        # 处理结果中的图片
                        output_images = resolve_outputs_ui(outputs_ui)
                        # 处理消息列表，识别出有用的信息
                        prompt_id, message = resolve_messages(messages)

                        if status == "error":
                            status = "failed"
                        elif status == "":
                            return

                        batchToolsUtils.update_sub_task_result(
                            prompt_id, status, json.dumps(output_images), message
                        )
                    else:
                        batchToolsUtils.update_lose_sub_task("failed", prompt_id)

            else:
                return
        except Exception as e:
            print("error checking status", e)
