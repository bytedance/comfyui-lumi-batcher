# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from enum import Enum


class PackageStatus(Enum):
    WAITING = "waiting"
    PACKAGING = "packing"
    SUCCESS = "succeed"
    FAILED = "failed"
