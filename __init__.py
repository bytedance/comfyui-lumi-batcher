# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later


def check_and_register_module():
    try:
        import lumi_batcher_service
    except ImportError:
        print("lumi_batcher_service模块未找到，正在重新注册...")
        from .prestartup_script import register_module

        register_module()


# 在导入前先检查模块是否存在
check_and_register_module()


from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from lumi_batcher_service.handler.common import CommonHandler
from lumi_batcher_service.controller.package.recover import recover_package

from lumi_batcher_service.hooks.task_start import batch_tools_task_start_hook
from lumi_batcher_service.hooks.task_done import batch_tools_task_done_hook

batchToolsHandler = BatchToolsHandler()
commonHandler = CommonHandler()
recover_package(batchToolsHandler)
# 任务-开始执行
batch_tools_task_start_hook(batchToolsHandler)
# 任务-执行完成
batch_tools_task_done_hook(batchToolsHandler)
NODE_CLASS_MAPPINGS = {}
NODE_INSTANCE_MAPPINGS = {}
WEB_DIRECTORY = "./frontend-setup"

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_INSTANCE_MAPPINGS", "WEB_DIRECTORY"]
