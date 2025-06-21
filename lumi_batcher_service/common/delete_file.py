import asyncio
import os
from typing import Callable, List, Optional


async def delete_file_async(
    file_path: str, callback: Optional[Callable[[str, bool], None]] = None
) -> bool:
    """
    异步删除文件

    :param file_path: 文件路径
    :param callback: 回调函数，参数为(文件路径, 是否成功)
    :return: 是否删除成功
    """
    try:
        # 使用线程池执行IO密集型操作
        loop = asyncio.get_running_loop()
        await loop.run_in_executor(None, os.remove, file_path)

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
