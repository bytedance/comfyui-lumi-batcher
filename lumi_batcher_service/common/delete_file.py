import asyncio
import os
import platform
from typing import Callable, List, Optional


async def delete_file_async(
    file_path: str, callback: Optional[Callable[[str, bool], None]] = None
) -> bool:
    """
    异步删除文件（兼容Windows）

    :param file_path: 文件路径（自动处理Windows路径分隔符）
    :param callback: 回调函数，参数为(文件路径, 是否成功)
    :return: 是否删除成功
    """
    try:
        # 统一处理路径分隔符
        normalized_path = os.path.normpath(file_path)

        # Windows下需要先重置文件属性
        if platform.system() == "Windows":
            try:
                os.chmod(normalized_path, 0o777)  # 确保有权限
            except:
                pass  # 如果修改权限失败仍尝试删除

        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, os.remove, normalized_path)

        if callback:
            callback(file_path, True)
        return True
    except Exception as e:
        if callback:
            callback(file_path, False)
        return False


async def batch_delete_files(
    file_paths: List[str],
    concurrency: int = 10,
    callback: Optional[Callable[[str, bool], None]] = None,
):
    """
    批量异步删除文件

    :param file_paths: 文件路径列表
    :param concurrency: 并发数量
    :param callback: 回调函数，参数为(文件路径, 是否成功)
    """
    semaphore = asyncio.Semaphore(concurrency)

    async def limited_delete(file_path):
        async with semaphore:
            return await delete_file_async(file_path, callback)

    tasks = [limited_delete(path) for path in file_paths]
    results = await asyncio.gather(*tasks)
    return results
