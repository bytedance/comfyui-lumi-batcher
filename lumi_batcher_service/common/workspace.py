# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import os
import shutil
import stat


# 工作区管理，用于创建目录、获取目录
class WorkSpaceManager:
    root_dir = ""

    def __init__(self, root_dir: str = None):
        self.root_dir = root_dir
        if root_dir is None:
            raise Exception("no root_dir specified")

        if os.path.exists(root_dir):
            print(f"{root_dir} has already been created")
        else:
            # 交付链路多进程启动
            try:
                # 当前工作目录直接创建
                os.mkdir(root_dir)
            except:  # noqa: E722
                pass

    # 创建目录
    def addDirectory(self, dir):
        resultPath = os.path.join(self.root_dir, dir)
        if os.path.exists(resultPath):
            print(f"{resultPath} has already been created")
        else:
            # 当前工作目录直接创建
            # 交付链路多进程启动
            try:
                # 当前工作目录直接创建
                os.mkdir(resultPath)
            except:  # noqa: E722
                pass

    # 获取目录
    def getDirectory(self, dir):
        resultPath = os.path.join(self.root_dir, dir)
        if os.path.exists(resultPath):
            return resultPath
        else:
            raise Exception("directory doesn't exist")

    # 删除目录
    def removeDirectory(self, dir):
        resultPath = os.path.join(self.root_dir, dir)
        if os.path.exists(resultPath):
            os.rmdir(resultPath)
        else:
            raise Exception("directory doesn't exist")

    def getDirectoryExists(self, dir) -> bool:
        resultPath = os.path.join(self.root_dir, dir)

        return os.path.exists(resultPath)

    def getFileExists(self, file_name, directory):
        resultPath = os.path.join(directory, file_name)
        return os.path.exists(resultPath)

    def getFilePath(self, directory_path, file_name):
        return os.path.join(self.getDirectory(directory_path), file_name)

    def getUsefulFileName(self, file_name, directory):
        """函数介绍

        用于判断文件目录下的是否存在同名文件，如果存在则会给一个唯一可用文件名

        Args:
            file_name (_type_): 文件名称
            directory (_type_): 目标目录

        Returns:
            _type_: 可用文件名称
        """
        count = 1
        fileName = file_name
        resultPath = os.path.join(directory, fileName)

        while os.path.exists(resultPath) is True:
            fileName = f"{file_name}({count})"
            count = count + 1

        return fileName

    def find_directories_with_prefix(self, prefix, path="."):
        """
        遍历指定目录，找到以指定前缀开头的文件夹。

        :param prefix: 文件夹前缀
        :param path: 要遍历的目录，默认为当前目录
        :return: 以指定前缀开头的文件夹列表
        """
        matching_directories = []

        # 遍历指定目录
        for root, dirs, files in os.walk(path):
            for dir_name in dirs:
                if dir_name.startswith(prefix):
                    matching_directories.append(os.path.join(root, dir_name))

        return matching_directories

    def delete_directories(self, directories):
        """
        批量删除指定的目录。

        :param directories: 待删除的目录列表
        """
        for directory in directories:
            try:
                shutil.rmtree(directory)
                print(f"Deleted directory: {directory}")
            except Exception as e:
                print(f"Failed to delete directory {directory}: {e}")

    def delete_file(self, file_path):
        """
        删除指定文件。

        :param file_path: 要删除的文件路径
        """
        try:
            # Normalize path for Windows
            file_path = os.path.normpath(file_path)

            # On Windows, try to remove read-only attribute if needed
            if os.name == "nt":
                try:
                    os.chmod(file_path, stat.S_IWRITE)  # Make file writable
                except Exception:
                    pass  # Continue even if permission change fails

            os.remove(file_path)
            print(f"Deleted file: {file_path}")
        except Exception as e:
            print(f"Failed to delete file {file_path}: {e}")
