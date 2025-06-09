# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
import json
import os
import traceback
from typing import Callable
from .patch_wrpper import monkey_patch_class_decorator
import execution
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from lumi_batcher_service.constant.task import CommonTaskStatus
from lumi_batcher_service.controller.output.value import (
    TaskOutputItem,
    TaskOutputItemValue,
)
from lumi_batcher_service.controller.output import output_processor_map
from lumi_batcher_service.common.file import get_file_mime
from lumi_batcher_service.controller.package.package import execute_package_batch_task


def resolve_outputs_ui(outputs_ui, output_nodes: list[int], prompt: dict) -> list[dict]:
    output: list[TaskOutputItem] = []
    for node_id in output_nodes:
        # 这里使用 {} 为默认值，因为这里的 id 是上层传入的，可能会瞎传
        node = prompt.get(node_id, {})
        class_type = node.get("class_type", None)
        inputs = node.get("inputs", None)
        # 参数校验，防止不规范的数据传进来
        if not inputs or not class_type or node_id not in outputs_ui:
            continue
        ui = outputs_ui[node_id]
        # 只有指定的 class
        if class_type in output_processor_map:
            processor = output_processor_map[class_type]
            result, output_key = processor(ui)
            if isinstance(result, list):
                outputs_value = [
                    TaskOutputItemValue(
                        type=item["type"],
                        value=item["value"],
                        format=get_file_mime(os.path.join("output", item["value"])),
                        cover=item.get("cover", None),
                    ).to_dict()
                    for item in result
                ]
                output.append(
                    TaskOutputItem(
                        node_id=node_id,
                        class_type=class_type,
                        output_key=output_key,
                        values=outputs_value,
                    ).to_dict()
                )
    return output


def resolve_messages(messages) -> tuple:
    result = ""
    prompt_id = ""
    try:
        for item in messages:
            type = item[0]
            log = item[1]

            if type == "execution_start":
                prompt_id = log.get("prompt_id", "")
            elif type == "execution_interrupted":
                result = "任务取消"
            elif type == "execution_error":
                exception_message = log.get("exception_message", "")
                result += exception_message

        if result == "":
            result = "任务成功"

    except Exception as e:
        # 打印异常信息
        print(f"Exception in thread: {e}")
        traceback.print_exc()
    finally:
        return (
            prompt_id,
            result,
        )


def batch_tools_task_done_hook(batchToolsHandler: BatchToolsHandler):
    @monkey_patch_class_decorator(execution.PromptQueue, "task_done")
    def overwrite_task_done(origin_fn: Callable, self, *args, **kwargs):
        print("comfyui lumi batcher overwrite task done")
        all_args = [*args, *kwargs.values()]

        try:
            # item_id = all_args[0]
            outputs_ui = all_args[1]
            status = all_args[2][0]
            # complete = all_args[2][1]
            messages = all_args[2][2]
            # 处理消息列表，识别出有用的信息
            prompt_id, message = resolve_messages(messages)

            if status == "error":
                status = CommonTaskStatus.FAILED.value
            else:
                status = CommonTaskStatus.SUCCESS.value

            if messages == "任务取消":
                status = CommonTaskStatus.CANCELLED.value

            # 更新任务状态
            if prompt_id != "":
                batchToolsHandler.batchSubTaskDao.update_property(
                    prompt_id, "status", status
                )

                batchSubTaskInfo = (
                    batchToolsHandler.batchSubTaskDao.get_task_by_prompt_id(prompt_id)
                )
                if batchSubTaskInfo is not None:
                    batch_task_id = batchSubTaskInfo.get("batch_task_id")
                    if batch_task_id is not None:
                        batchTaskInfo = batchToolsHandler.batchTaskDao.get_task_by_id(
                            batch_task_id
                        )
                        queue_count = batchTaskInfo.get("queue_count")
                        batch_task_status = batchTaskInfo.get("status")
                        status_counts = json.loads(batchTaskInfo.get("status_counts"))
                        extra = json.loads(batchTaskInfo.get("extra"))
                        current_status = batchTaskInfo.get("status")
                        output_nodes = extra.get("output_nodes", [])
                        prompt = extra.get("prompt", {})

                        # 非终态状态下重新计算任务状态
                        if current_status is not None and current_status not in [
                            CommonTaskStatus.SUCCESS.value,
                            CommonTaskStatus.PARTIAL_SUCCESS.value,
                            CommonTaskStatus.CANCELLED.value,
                        ]:
                            status_counts[status] = status_counts.get(status, 0) + 1

                            success_count = status_counts.get(
                                CommonTaskStatus.SUCCESS.value, 0
                            )
                            failed_count = status_counts.get(
                                CommonTaskStatus.FAILED.value, 0
                            )
                            canceled_count = status_counts.get(
                                CommonTaskStatus.CANCELLED.value, 0
                            )
                            create_failed_count = status_counts.get(
                                CommonTaskStatus.CREATE_FAILED.value, 0
                            )

                            result_status_count = (
                                success_count
                                + failed_count
                                + canceled_count
                                + create_failed_count
                            )

                            if queue_count <= result_status_count:
                                if (
                                    create_failed_count + failed_count + canceled_count
                                    == queue_count
                                ):
                                    batch_task_status = CommonTaskStatus.FAILED.value
                                elif success_count == queue_count:
                                    batch_task_status = CommonTaskStatus.SUCCESS.value
                                elif canceled_count == queue_count:
                                    batch_task_status = CommonTaskStatus.CANCELLED.value
                                elif success_count > 0:
                                    batch_task_status = (
                                        CommonTaskStatus.PARTIAL_SUCCESS.value
                                    )

                            elif result_status_count > 0:
                                batch_task_status = CommonTaskStatus.RUNNING.value
                            else:
                                batch_task_status = CommonTaskStatus.WAITING.value

                            batchToolsHandler.batchTaskDao.update_property(
                                batch_task_id,
                                "status_counts",
                                json.dumps(status_counts),
                            )

                            # 更新批量任务状态
                            batchToolsHandler.batchTaskDao.update_property(
                                batch_task_id, "status", batch_task_status
                            )

                        # 更新批量任务消息
                        messagesSet = set(
                            json.loads(batchTaskInfo.get("messages", "[]"))
                        )
                        messagesSet.add(message)
                        batchToolsHandler.batchTaskDao.update_property(
                            batch_task_id, "messages", json.dumps(list(messagesSet))
                        )

                        # 处理输出结果, 兼容旧版本
                        if "outputs" in outputs_ui:
                            outputs_ui = outputs_ui["outputs"]

                        # 处理子任务结果
                        batchToolsHandler.batchSubTaskDao.update_property(
                            prompt_id,
                            "output",
                            json.dumps(
                                resolve_outputs_ui(outputs_ui, output_nodes, prompt)
                            ),
                        )

                        # 结果打包
                        if batch_task_status in [
                            CommonTaskStatus.SUCCESS.value,
                            CommonTaskStatus.PARTIAL_SUCCESS.value,
                            CommonTaskStatus.CANCELLED.value,
                        ]:
                            loop = asyncio.new_event_loop()
                            loop.run_until_complete(
                                execute_package_batch_task(
                                    batchToolsHandler, batch_task_id
                                )
                            )

        except Exception as e:
            print("comfyui lumi batcher overwrite task done error", e)
            traceback.print_exc()
        finally:
            return origin_fn(self, *args, **kwargs)
