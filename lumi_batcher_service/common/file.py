# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
from concurrent.futures import ThreadPoolExecutor
import json
import mimetypes
import shutil
import os
import filetype
import re
import urllib.parse

import os
from pathlib import Path


# 拷贝文件
def copyFile(source_file, destination_file):
    try:
        print(f"源文件目录 {source_file}，目标文件目录{destination_file}")
        shutil.copy2(source_file, destination_file)
        print(f"文件已成功拷贝到 {destination_file}")
    except IOError as e:
        print(f"无法拷贝文件. {e}")


def copy_file_sync(src, dst):
    """
    同步版本的文件拷贝方法
    """
    if not os.path.isfile(src):
        print(f"源文件 {src} 不存在。")
        return False

    if os.path.isdir(dst):
        dst = os.path.join(dst, os.path.basename(src))

    try:
        shutil.copy2(src, dst)
        print(f"文件从 {src} 复制到 {dst} 完成")
        return True
    except IOError as e:
        print(f"无法拷贝文件. {e}")
        return False


async def copy_file_v2(src, dst):
    """
    拷贝文件从源路径到目标路径，并尝试保留元数据。

    :param src: 源文件路径
    :param dst: 目标文件路径或目录
    :return: None
    """
    # 确保源文件存在
    if not os.path.isfile(src):
        print(f"源文件 {src} 不存在。")
        return

    # 如果目标路径是目录，则将文件名添加到目标路径
    if os.path.isdir(dst):
        dst = os.path.join(dst, os.path.basename(src))

    # 拷贝文件并保留元数据
    try:
        loop = asyncio.get_event_loop()
        # 使用ThreadPoolExecutor来避免阻塞事件循环
        with ThreadPoolExecutor() as pool:
            await loop.run_in_executor(pool, shutil.copy2, src, dst)
            # print(f"文件从 {src} 复制到 {dst} 完成")
    except IOError as e:
        print(f"无法拷贝文件. {e}")


"""
通过文件的扩展名，判断是否是一个压缩包文件
"""


def is_compressed_file(file_path):
    _, ext = os.path.splitext(file_path)
    return ext.lower() in [".zip", ".tar", ".tar.gz", ".tgz", ".tar.bz2", ".tbz"]


def get_file_mime(file_path: str):
    """
    获取文件的 mime, 如果文件不存在或者不可识别的文件类型，返回 None
    """
    if not os.path.isfile(file_path):
        return None

    return filetype.guess_mime(file_path)


def get_file_info(filepath):
    # 获取文件名（带后缀）
    filename = os.path.basename(filepath)

    # 获取文件后缀（小写形式）
    file_ext = os.path.splitext(filepath)[1].lower()

    # 获取文件类型
    mime_type = mimetypes.guess_type(filepath)[0]
    file_type = "unknown"

    if mime_type:
        if mime_type.startswith("image/"):
            file_type = "image"
        elif mime_type.startswith("video/"):
            file_type = "video"

    return {"file_name": filename, "file_ext": file_ext, "type": file_type}


class FileProcessor:
    def __init__(self):
        self.isWindows = os.name == "nt"
        self.invalid_chars = re.compile(r'[<>:"/\\|?*\x00-\x1F]')  # 包含控制字符
        self.max_length = 240

    def sanitize_filename(self, dir, filename):
        """最终版文件名处理方法"""
        # 处理URL编码（可选）
        try:
            filename = urllib.parse.unquote(filename)
        except:
            pass

        # 替换非法字符
        clean = self.invalid_chars.sub("_", filename)
        clean = re.sub(r"_{2,}", "_", clean)  # 合并连续下划线

        # 智能截断（同时考虑字符数和字节数）
        if self.isWindows:
            full_path = os.path.join(dir, clean)
            if len(full_path.encode("utf-8")) > self.max_length:
                encoded = full_path.encode("utf-8")[: self.max_length]
                while True:
                    try:
                        full_path = encoded.decode("utf-8")
                        break
                    except UnicodeDecodeError:
                        encoded = encoded[:-1]
                clean = os.path.basename(full_path)
        elif len(clean.encode("utf-8")) > self.max_length:
            encoded = clean.encode("utf-8")[: self.max_length]
            while True:
                try:
                    clean = encoded.decode("utf-8")
                    break
                except UnicodeDecodeError:
                    encoded = encoded[:-1]

        # 去除首尾空格和点
        clean = clean.strip(". ")
        return clean or "unnamed"  # 保证至少返回一个默认名称

    def save_json_array_to_txt(self, dir_path, filename, json_str):
        """
        将JSON数组写入TXT文件（每行一个元素）
        :param dir_path: 已处理好的目录路径
        :param filename: 已处理好的文件名
        :param json_str: JSON数组字符串
        :return: None（出错时抛出异常）
        """
        try:
            items = json.loads(json_str)
            if not isinstance(items, list):
                raise ValueError("Input JSON is not an array")

            # 拼接完整路径
            filepath = os.path.join(dir_path, filename)

            # 写入文件（自动创建目录）
            os.makedirs(dir_path, exist_ok=True)
            with open(filepath, "w", encoding="utf-8") as f:
                for item in items:
                    f.write(f"{item}\n")

        except json.JSONDecodeError as e:
            raise ValueError(f"JSON解析失败: {e}")
        except OSError as e:
            raise IOError(f"文件写入失败: {e}")


file_processor = FileProcessor()


def find_comfyui_dir(start_path=None, max_depth=10):
    """
    从指定路径向上递归查找名为ComfyUI的父目录

    参数:
        start_path: 起始路径(默认为当前文件所在目录)
        max_depth: 最大递归深度(防止无限循环)

    返回:
        找到的ComfyUI目录绝对路径，未找到返回None
    """
    if start_path is None:
        # 获取当前文件的绝对路径
        start_path = os.path.dirname(os.path.abspath(__file__))

    current_path = Path(start_path)
    depth = 0

    while depth < max_depth and current_path != current_path.parent:
        # 兼容ComfyUI，ComfyUI_***目录场景
        if current_path.name.startswith("ComfyUI"):
            return str(current_path)
        current_path = current_path.parent
        depth += 1

    # 如果找不到，默认找到当前工作目录
    return os.getcwd()


def get_file_absolute_path(file_path):
    """
    获取文件的绝对路径，如果文件不存在则返回None
    :param file_path: 文件路径
    :return: 文件的绝对路径或None
    """
    comfyui_dir = find_comfyui_dir()

    return (
        os.path.join(comfyui_dir, file_path[2:])
        if file_path.startswith("./")
        else os.path.join(comfyui_dir, file_path)
    )
