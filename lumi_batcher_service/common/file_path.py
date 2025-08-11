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

    # 提取目标文件夹名称（无论原始路径层级）
    target_folder = target_dir.name.lower() if is_windows else target_dir.name

    # 标准化路径并分割为组件
    try:
        path_str = path_obj.as_posix().lower() if is_windows else path_obj.as_posix()
        path_components = [comp for comp in path_str.rstrip("/").split("/") if comp]
    except Exception:
        return False

    # 检查目标文件夹是否存在于路径的任何层级
    return target_folder in path_components


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

            # 提取白名单路径的最后一个文件夹名称
            # 移除尾部斜杠并分割路径
            white_folder = white_str.rstrip("/").split("/")[-1]
            # 分割目标路径为组件并过滤空字符串
            path_components = [comp for comp in path_str.rstrip("/").split("/") if comp]

            # 检查白名单文件夹是否存在于路径的任何层级
            if white_folder in path_components:
                return True
        else:
            # Unix-like系统优化为名称级匹配
            path_str = path_obj.as_posix()
            white_str = white_dir_obj.as_posix()

            # 提取白名单路径的最后一个文件夹名称
            white_folder = white_str.rstrip("/").split("/")[-1]
            # 分割目标路径为组件并过滤空字符串
            path_components = [comp for comp in path_str.rstrip("/").split("/") if comp]

            # 检查白名单文件夹是否存在于路径的任何层级
            # 保留Unix系统大小写敏感性
            if white_folder in path_components:
                return True

    return False
