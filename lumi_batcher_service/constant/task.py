# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from dataclasses import dataclass
from lumi_batcher_service.common.to_dict_class import ToDictBase
from enum import Enum


class Category(Enum):
    SYSTEM = "system"
    """
    系统生成（工具服务逻辑内生成）
    """
    CUSTOM = "用户自定义"


@dataclass
class StatusCounts(ToDictBase):
    # 创建失败
    create_failed: int = 0
    # 等待中（子任务聚合数量）
    pending: int = 0
    # 成功（子任务聚合数量）
    success: int = 0
    # 失败（子任务聚合数量）
    failed: int = 0
    # 取消
    cancelled: int = 0


@dataclass
class PackageInfo(ToDictBase):
    result: str = ""
    status: str = "waiting"
    message: str = ""


class CommonTaskStatus(Enum):
    RUNNING = "running"
    """
    正在执行中
    """
    PENDING = "pending"
    """
    正在队列排队中
    """
    CANCELLED = "cancelled"
    """
    已取消
    """
    PAUSED = "paused"
    """
    已暂停
    """
    SUCCESS = "success"
    """
    已成功
    """
    FAILED = "failed"
    """
    已失败
    """
    CREATE_FAILED = "create_failed"
    """
    创建失败
    """
    PARTIAL_SUCCESS = "partial_success"
    """
    部分成功
    """
    WAITING = "waiting"
    """
    等待中
    """
