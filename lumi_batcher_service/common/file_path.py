from pathlib import Path


def is_under_lumi_batcher(path: str) -> bool:
    """判断路径是否位于comfyui-lumi-batcher目录下

    Args:
        path: 待检查的路径（相对或绝对路径）

    Returns:
        bool: True表示在目标目录下，False表示不在
    """
    target_dir = Path("custom_nodes/comfyui-lumi-batcher").resolve()  # 解析为绝对路径
    try:
        return Path(path).resolve().is_relative_to(target_dir)
    except FileNotFoundError:
        # 路径不存在时仍可判断逻辑关系
        return Path(path).expanduser().resolve().is_relative_to(target_dir)


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

    try:
        return any(
            Path(path).resolve().is_relative_to(Path(white_dir).resolve())
            for white_dir in white_dir_list
        )
    except FileNotFoundError:
        # 路径不存在时仍可判断逻辑关系
        return any(
            Path(path).expanduser().resolve().is_relative_to(Path(white_dir).resolve())
            for white_dir in white_dir_list
        )
