# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
import traceback
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from .package import execute_package_batch_task


def recover_package(batchToolsHandler: BatchToolsHandler):
    try:
        # 查询所有打包未完成的任务
        batchTaskList = batchToolsHandler.batchTaskDao.get_unpackage_list()
        for batchTask in batchTaskList:
            batch_task_id = batchTask.get("id", "")
            if batch_task_id == "":
                continue
            loop = asyncio.new_event_loop()
            loop.run_until_complete(
                execute_package_batch_task(batchToolsHandler, batch_task_id)
            )
    except Exception as e:
        print(e)
        traceback.print_exc()
        pass
