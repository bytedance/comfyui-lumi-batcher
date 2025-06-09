# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import importlib
from functools import wraps
from typing import Callable

origin_fn_key = "__original__"


def monkey_patch_decorator(original_func: Callable):
    def decorator(new_func: Callable):
        @wraps(original_func)
        def wrapper(*args, **kwargs):
            origin_fn = getattr(wrapper, origin_fn_key)
            return new_func(origin_fn, *args, **kwargs)

        setattr(wrapper, origin_fn_key, original_func)
        # 获取原函数的模块名称和函数名
        module_name = original_func.__module__
        fn_name = original_func.__name__
        # 动态导入原函数所在的模块
        module = importlib.import_module(module_name)
        # 动态替换函数
        setattr(module, fn_name, wrapper)
        return wrapper

    return decorator


def monkey_patch_class_decorator(origin_class, fn_name):
    def decorator(new_method):
        origin_method = getattr(origin_class, fn_name)

        @wraps(origin_method)
        def wrapped(*args, **kwargs):
            origin_fn = getattr(wrapped, origin_fn_key)
            return new_method(origin_fn, *args, **kwargs)

        setattr(wrapped, origin_fn_key, origin_method)
        setattr(origin_class, fn_name, wrapped)
        return wrapped

    return decorator
