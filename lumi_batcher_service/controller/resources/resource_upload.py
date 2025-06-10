# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import os
import traceback
import uuid
from lumi_batcher_service.thread.task_scheduler_manager import ThreadTaskManager
from lumi_batcher_service.common.file import (
    get_file_absolute_path,
    get_file_info,
    copy_file_v2,
)
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from lumi_batcher_service.thread.utils import sync_wrapper


class ResourceUpload:
    threadTaskManager: ThreadTaskManager
    batchToolsHandler: BatchToolsHandler

    @property
    def shareContext(self):
        return self.threadTaskManager.sharedContext

    def __init__(self, batchToolsHandler: BatchToolsHandler, maxWorkers: int) -> None:
        self.threadTaskManager = ThreadTaskManager(maxWorkers)
        self.batchToolsHandler = batchToolsHandler

    def createUploadTask(self, batch_task_id: str, paramsConfig: list[dict]):
        paths = self.parseFileByParamsConfig(paramsConfig)
        for path in paths:
            self.threadTaskManager.add_task(self.createFileUpload, path, batch_task_id)

    def createFileUpload(self, filePath: str, batchTaskId: str):
        try:
            file_info = get_file_info(filePath)

            file_name = file_info.get("file_name")
            file_ext = file_info.get("file_ext")
            file_type = file_info.get("type")
            resource_id = str(uuid.uuid4())

            # 文件写入
            sync_wrapper(
                copy_file_v2(
                    filePath,
                    os.path.join(
                        self.batchToolsHandler.workSpaceManager.getDirectory(
                            self.batchToolsHandler.resources_path
                        ),
                        f"{resource_id}{file_ext}",
                    ),
                )
            )

            # 插入数据
            self.batchToolsHandler.resourcesDao.insert(
                batchTaskId, resource_id, file_type, file_name, file_ext
            )
        except Exception as e:
            print(f"Exception in createFileUpload: {e}")
            traceback.print_exc()

    def parseFileByParamsConfig(self, paramsConfig: list[dict]) -> list[str]:
        result = []
        for config in paramsConfig:
            configType = config.get("type", "")
            if configType == "group":
                for subConfig in config.get("values", []):
                    result += self._parseSingleConfig(subConfig)

            result += self._parseSingleConfig(config)

        return result

    def _parseSingleConfig(self, config: dict) -> list[str]:
        result = []
        values = config.get("values", [])

        for value in values:
            try:
                file_origin_path = f"input/{str(value)}"
                filePath = os.path.join(os.getcwd(), file_origin_path)
                if not os.path.exists(filePath):
                    new_file_path = get_file_absolute_path(file_origin_path)
                    if os.path.exists(new_file_path):
                        filePath = new_file_path
                    else:
                        # 如果文件不存在，跳过
                        continue

                result.append(filePath)
            except Exception as e:
                print(f"Exception in _parseSingleConfig: {e}")
                traceback.print_exc()

        return result

    def _getRealFileName(self, path: str) -> str:
        # 获取当前工作目录
        current_dir = os.getcwd()

        # 构建前缀路径
        prefix = os.path.join(current_dir, "input")

        # 检查路径是否以前缀开头
        if path.startswith(prefix):
            # 提取value部分, +1 是为了去掉路径中的斜杠
            value = path[len(prefix) + 1 :]
            return value
        else:
            return ""
