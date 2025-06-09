# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import json
from typing import Callable
from .patch_wrpper import monkey_patch_class_decorator
import server
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from lumi_batcher_service.constant.task import CommonTaskStatus


def batch_tools_task_start_hook(batchToolsHandler: BatchToolsHandler):
    @monkey_patch_class_decorator(server.PromptServer, "send_sync")
    def overwrite_execution(origin_fn: Callable, self, *args, **kwargs):
        # print("comfyui lumi batcher overwrite execution start")
        all_args = [*args, *kwargs.values()]
        # ["execution_start", {"prompt_id": "91ce3e95-448a-40b5-bc0b-9e6896e21a1f"}, "1d7af25be41449e2a4a192dbad9e263d"]
        try:
            type = all_args[0]
            if type == "execution_start":
                prompt_id = all_args[1].get("prompt_id", None)
                if prompt_id is not None:
                    batchToolsHandler.batchSubTaskDao.update_property(
                        prompt_id, "status", CommonTaskStatus.RUNNING.value
                    )
                    # print(
                    #     "--------------更新成功------------------", json.dumps(all_args)
                    # )

        except Exception as e:
            print("batch tools overwrite execution failed", e)

        return origin_fn(self, *args, **kwargs)
