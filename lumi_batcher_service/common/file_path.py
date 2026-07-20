import os
import posixpath
from pathlib import Path


def _get_dynamic_white_dirs() -> list[str]:
    """读取 ComfyUI 的动态目录配置（如自定义 output 目录）。"""
    try:
        import folder_paths

        return [
            folder_paths.get_output_directory(),
            folder_paths.get_input_directory(),
        ]
    except Exception:
        return []


def _safe_resolve(path):
    try:
        return Path(path).expanduser().resolve(strict=False)
    except (OSError, RuntimeError, TypeError, ValueError):
        return None


def is_path_under_directory(path, directory) -> bool:
    """判断 path 是否真实位于 directory 内，兼容未创建的目标文件。"""
    path_obj = _safe_resolve(path)
    directory_obj = _safe_resolve(directory)

    if path_obj is None or directory_obj is None:
        return False

    try:
        path_value = os.path.normcase(os.fspath(path_obj))
        directory_value = os.path.normcase(os.fspath(directory_obj))
        return os.path.commonpath([path_value, directory_value]) == directory_value
    except (OSError, ValueError):
        return False


def get_safe_upload_filename(filename):
    if not filename:
        return None

    safe_filename = posixpath.basename(filename.replace("\\", "/"))
    if safe_filename in ("", ".", "..") or "\x00" in safe_filename:
        return None

    return safe_filename


def _get_lumi_batcher_root():
    try:
        return Path(__file__).resolve(strict=False).parents[2]
    except (OSError, RuntimeError, ValueError):
        return Path(os.path.join("custom_nodes", "comfyui-lumi-batcher"))


def is_under_lumi_batcher(path: str) -> bool:
    """判断路径是否位于comfyui-lumi-batcher目录下

    Args:
        path: 待检查的路径（相对或绝对路径）

    Returns:
        bool: True表示在目标目录下，False表示不在
    """
    white_dir_list = [
        _get_lumi_batcher_root(),
        os.path.join("custom_nodes", "comfyui-lumi-batcher"),
    ]

    return any(is_path_under_directory(path, white_dir) for white_dir in white_dir_list)


def is_under_delete_white_dir(path: str) -> bool:
    """判断路径是否位于允许读取或删除的目录下。

    Args:
        path: 待检查的路径（相对或绝对路径）

    Returns:
        bool: True表示在目标目录下，False表示不在
    """
    white_dir_list = [
        "comfyui_lumi_batcher_workspace",
        "input",
        "output",
    ]  # 白名单目录列表
    white_dir_list.extend(_get_dynamic_white_dirs())

    return any(
        is_path_under_directory(path, white_dir)
        for white_dir in white_dir_list
        if white_dir
    )
