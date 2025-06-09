# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from dataclasses import dataclass, field
from enum import Enum

from lumi_batcher_service.common.to_dict_class import ToDictBase


class OutputNodeType(Enum):
    Image = "image"
    Video = "video"
    Text = "text"


@dataclass
class TaskOutputItemValue(ToDictBase):
    type: OutputNodeType
    value: str
    format: str | None = None  # 文件格式，即文件 MIME 类型
    cover: str | None = None  # 视频的封面


@dataclass
class TaskOutputItem(ToDictBase):
    values: list[TaskOutputItemValue] = field(default_factory=list)
    node_id: str = ""
    class_type: str = ""
    output_key: str = ""
