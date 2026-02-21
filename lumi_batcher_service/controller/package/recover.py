# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
import traceback
from functools import partial
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from .package import execute_package_batch_task


def _on_recover_task_done(task: asyncio.Task, batch_task_id: str):
    try:
        task.result()
    except Exception as e:
        print(f"recover package task failed, batch_task_id={batch_task_id}: {e}")
        traceback.print_exc()


async def _recover_package_without_running_loop(
    batchToolsHandler: BatchToolsHandler, batch_task_ids: list[str]
):
    for batch_task_id in batch_task_ids:
        await execute_package_batch_task(batchToolsHandler, batch_task_id)


def recover_package(batchToolsHandler: BatchToolsHandler):
    try:
        # 查询所有打包未完成的任务
        batchTaskList = batchToolsHandler.batchTaskDao.get_unpackage_list()
        batch_task_ids = []
        for batchTask in batchTaskList:
            batch_task_id = batchTask.get("id", "")
            if batch_task_id != "":
                batch_task_ids.append(batch_task_id)

        if len(batch_task_ids) == 0:
            return

        try:
            running_loop = asyncio.get_running_loop()
        except RuntimeError:
            asyncio.run(
                _recover_package_without_running_loop(batchToolsHandler, batch_task_ids)
            )
        else:
            for batch_task_id in batch_task_ids:
                task = running_loop.create_task(
                    execute_package_batch_task(batchToolsHandler, batch_task_id)
                )
                task.add_done_callback(
                    partial(_on_recover_task_done, batch_task_id=batch_task_id)
                )
    except Exception as e:
        print(e)
        traceback.print_exc()
        pass
