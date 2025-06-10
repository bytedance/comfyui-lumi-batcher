# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import io
import os
import pandas
import zipfile
from .file import copyFile, get_file_absolute_path, find_comfyui_dir


class ResolveFileManager:
    def resolve_binary(self, binary, file_extension):
        if file_extension == ".txt":
            return self.resolve_txt_binary(binary)
        elif file_extension in [".xls", ".xlsx"]:
            return self.resolve_excel_binary(binary, file_extension)
        else:
            return []

    def resolve_file(self, path: str, file_extension):
        if file_extension == ".txt":
            return self.resolve_txt_file(path)
        elif file_extension in [".xls", ".xlsx"]:
            return self.resolve_excel_file(path)
        elif file_extension == ".zip":
            return self.resolve_zip_file(path)
        else:
            return self.resolve_single_file(path)

    # 解析txt文件
    def resolve_txt_file(self, path: str) -> list[str]:
        try:
            with open(path, "r", encoding="utf-8") as file:
                # 读取文件的全部内容
                file_content = file.read()

                return file_content.split("\n")
        except Exception as e:
            print("resolve txt file error", e)

    # 从 binary 解析txt文件
    def resolve_txt_binary(self, data) -> list[str]:
        try:
            return data.decode("utf-8").split("\n")
        except Exception as e:
            print("resolve txt binary error", e)

    def resolve_excel_file(self, path) -> list[str]:
        try:
            file_name = os.path.basename(path)
            _, file_extension = os.path.splitext(file_name)

            file_content = ""

            if file_extension == ".xls":
                # 读取.xls文件
                file_content = pandas.read_excel(path, engine="xlrd")
            elif file_extension == ".xlsx":
                # 读取.xlsx文件
                file_content = pandas.read_excel(path, engine="openpyxl")

            res = []

            if "value" in file_content:
                res = [item for item in file_content.value if not pandas.isna(item)]

            return res
        except Exception as e:
            print("resolve excel file error", e)

    def resolve_excel_binary(self, data, file_extension: str) -> list[str]:
        try:
            # 使用 BytesIO 将二进制流转换为文件对象
            excel_file = io.BytesIO(data)

            if file_extension == ".xls":
                # 读取.xls文件
                file_content = pandas.read_excel(excel_file, engine="xlrd")
            elif file_extension == ".xlsx":
                # 读取.xlsx文件
                file_content = pandas.read_excel(excel_file, engine="openpyxl")

            res = []

            if "value" in file_content:
                res = file_content.value

            return res
        except Exception as e:
            print("resolve excel binary error", e)

    def resolve_zip_file(self, path) -> list[str]:
        res = []
        # 打开ZIP文件
        with zipfile.ZipFile(path, "r") as zip_ref:
            output_directory = os.path.join("input")
            if os.getcwd() != "ComfyUI":
                comfyui_dir = find_comfyui_dir()
                output_directory = os.path.join(comfyui_dir, "input")

            if not os.path.exists(output_directory):
                os.makedirs(output_directory)

            # 获取ZIP文件中所有文件的列表
            zip_files = zip_ref.namelist()

            # 遍历文件列表
            for file in zip_files:
                try:
                    file_name = os.path.basename(file.encode("cp437").decode("utf-8"))
                except Exception:
                    file_name = os.path.basename(file)
                # file_name = os.path.basename(file.encode("cp437").decode("utf-8"))

                if file_name.startswith("._"):
                    continue
                # 检查文件是否是图片（根据文件扩展名）
                if file.lower().endswith((".png", ".jpg", ".jpeg")):
                    # 读取图片内容
                    image_data = zip_ref.read(file)
                    # 完整的输出路径
                    output_path = os.path.join(output_directory, file_name)
                    # 将图片写入输出目录
                    with open(output_path, "wb") as image_file:
                        image_file.write(image_data)
                        res.append(file_name)
                elif file.lower().endswith((".mp4", ".mov", ".avi", ".mkv")):
                    # 读取视频内容
                    video_data = zip_ref.read(file)
                    # 完整的输出路径
                    output_path = os.path.join(output_directory, file_name)
                    # 将视频写入输出目录
                    with open(output_path, "wb") as video_file:
                        video_file.write(video_data)
                        res.append(file_name)
        return res

    def resolve_single_file(self, path) -> list[str]:
        file_name = os.path.basename(path)
        if os.getcwd() != "ComfyUI":
            copyFile(path, get_file_absolute_path(f"input/{file_name}"))
        else:
            copyFile(path, os.path.join("input", file_name))
        return [file_name]


resolveFileManager = ResolveFileManager()
