# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import uuid
from lumi_batcher_service.constant.task import Category


def getImagePrefix(task_id: str):
    return "Batch_Task_{}".format(task_id)


def getSaveImageConfig(prompt, id):
    saveImageNodes = {
        k: v
        for k, v in prompt.items()
        if "class_type" in v and v["class_type"] == "SaveImage"
    }

    if not saveImageNodes:
        return []

    config_list = []

    for key, v in saveImageNodes.items():
        filename_prefix = ""

        if "inputs" in v and "filename_prefix" in v["inputs"]:
            filename_prefix = v["inputs"]["filename_prefix"]

        new_prefix = "{}_{}".format(getImagePrefix(id), filename_prefix)

        config_list.append(
            {
                "category": Category.SYSTEM.value,
                "type": "string",
                "nodeId": key,
                "internal_name": "filename_prefix",
                "name": "",
                "config_id": str(uuid.uuid4()),
                "values": [new_prefix],
            }
        )

    return config_list
