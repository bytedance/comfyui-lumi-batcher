# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import os
from lumi_batcher_service.handler.batch_tools import BatchToolsHandler
from .resource_upload import ResourceUpload


class ResourceController:
    batchToolsHandler: BatchToolsHandler

    def __init__(self, batchToolsHandler: BatchToolsHandler):
        self.batchToolsHandler = batchToolsHandler
        self.resourceUpload = ResourceUpload(batchToolsHandler, 10)

    def get_resources_map(self, batchTaskId):
        res = self.get_resources_list(batchTaskId)
        resMap = {}
        for item in res:
            file_name = item.get("file_name", None)
            file_ext = item.get("file_ext", None)
            id = item.get("id", None)
            if file_name is not None and id is not None:
                resMap[file_name] = f"{id}{file_ext}"
        return resMap

    def get_resources_list(self, batchTaskId):
        try:
            return self.batchToolsHandler.resourcesDao.get_result(batchTaskId)
        except Exception as e:
            print(e)
            return []

    def get_resource_path(self, file_name):
        try:
            return os.path.join(
                self.batchToolsHandler.workSpaceManager.getDirectory(
                    self.batchToolsHandler.resources_path
                ),
                file_name,
            )
        except Exception as e:
            print(e)
            return None
