import os
from pathlib import Path
import sys


def is_under_lumi_batcher(path: str) -> bool:
    """判断路径是否位于comfyui-lumi-batcher目录下

    Args:
        path: 待检查的路径（相对或绝对路径）

    Returns:
        bool: True表示在目标目录下，False表示不在
    """
    # 使用os.path.join确保跨平台路径分隔符正确
    target_dir = Path(os.path.join("custom_nodes", "comfyui-lumi-batcher")).resolve(
        strict=False
    )
    is_windows = sys.platform.startswith("win")

    try:
        path_obj = Path(path).expanduser().resolve(strict=False)
    except Exception:
        # 极端路径解析失败时降级处理
        path_obj = Path(path).expanduser()

    if is_windows:
        # Windows: 大小写不敏感的路径前缀匹配
        target_str = str(target_dir).lower()
        path_str = str(path_obj).lower()
        return path_str == target_str or path_str.startswith(f"{target_str}{os.sep}")
    else:
        # Unix-like: 保持原有的is_relative_to精确匹配
        return path_obj.is_relative_to(target_dir)


def is_under_delete_white_dir(path: str) -> bool:
    """判断路径是否位于comfyui-lumi-batcher目录下

    Args:
        path: 待检查的路径（相对或绝对路径）

    Returns:
        bool: True表示在目标目录下，False表示不在
    """
    white_dir_list = [
        "custom_nodes/comfyui-lumi-batcher",
        "comfyui_lumi_batcher_workspace",
        "input",
        "output",
    ]  # 白名单目录列表

    is_windows = sys.platform.startswith("win")

    try:
        # 基础路径解析（存在的路径）
        path_obj = Path(path).expanduser().resolve(strict=False)
    except Exception:
        # 极端情况容错（如无效路径字符）
        path_obj = Path(path).expanduser()

    for white_dir in white_dir_list:
        try:
            white_dir_obj = Path(white_dir).expanduser().resolve(strict=False)
        except Exception:
            white_dir_obj = Path(white_dir).expanduser()

        if is_windows:
            # Windows路径处理：转为小写POSIX格式后比较
            path_str = path_obj.as_posix().lower()
            white_str = white_dir_obj.as_posix().lower()
            if path_str == white_str or path_str.startswith(f"{white_str}/"):
                return True
        else:
            # Unix-like系统保持原逻辑
            if path_obj.is_relative_to(white_dir_obj):
                return True

    return False
