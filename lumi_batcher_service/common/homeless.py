# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from functools import wraps
import json
import math
import os
import re
import time


def truncate_string(s: str, max_length: int):
    # 如果字符串长度超过最大长度，则截断字符串
    if len(s) > max_length:
        return s[:max_length]
    return s


def sanitize_string(s: str) -> str:
    """
    过滤字符串中的特殊字符
    """
    # 定义要过滤的特殊字符
    special_chars = r'[\/:*?"<>|]'
    # 使用正则表达式替换特殊字符为空字符串
    result = re.sub(special_chars, "", s)
    return result


def get_max_workers(task_type="io"):
    """
    获取系统最大cpu核心数
    """
    cpu_count = os.cpu_count()
    if task_type == "io":
        return cpu_count * 2
    elif task_type == "cpu":
        return cpu_count
    else:
        return cpu_count


def timing_decorator(func):
    """
    计算函数执行耗时
    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()  # 记录开始时间
        result = func(*args, **kwargs)  # 执行被装饰的函数
        end_time = time.time()  # 记录结束时间
        elapsed_time = end_time - start_time  # 计算耗时
        print(f"函数 {func.__name__} 执行耗时: {elapsed_time:.4f} 秒")
        return result  # 返回被装饰函数的结果

    return wrapper


def replace_json_nan_str(json_str: str, replace_str="") -> str:
    """
    将json字符串中的NAN处理成空字符串
    """

    return re.sub(r"\b(?:NaN|nan)\b", "", json_str)
