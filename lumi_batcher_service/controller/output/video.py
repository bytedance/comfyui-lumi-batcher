# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import os
import re
from .value import OutputNodeType


def process_vhs_video_combine(ui):
    result = None
    output_key = "gifs"

    if output_key in ui:
        videoList = ui[output_key]
        if isinstance(videoList, list):
            for item in videoList:
                if result is None:
                    result = []
                # 获取封面数据
                filename = item.get("filename", "")
                file_format = item.get("format", "")
                format_type = file_format.split("/")[0]
                file_path = os.path.join(item["subfolder"], filename)

                if format_type == "image":
                    # 因为这个节点也可以输出 gifs 或者 webp
                    result.append({"type": OutputNodeType.Image, "value": file_path})
                else:
                    cover_path = re.sub(r"\.\w+$", ".png", file_path)
                    result.append(
                        {
                            "type": OutputNodeType.Video,
                            "value": file_path,
                            "cover": cover_path,
                            "format": file_format,
                        }
                    )

    return result, output_key


def process_save_video(ui):
    result = []

    if "images" in ui:
        output_key = "images"
        videoList = ui.get(output_key, [])
        if isinstance(videoList, list):
            for item in videoList:
                filename = item.get("filename", "")
                subfolder = item.get("subfolder", "")
                file_path = os.path.join(subfolder, filename)
                result.append(
                    {
                        "type": OutputNodeType.Video,
                        "value": file_path,
                    }
                )
    elif "text" in ui:
        # 兼容AIP-AIGC插件的输出协议
        output_key = "text"
        videoList = ui.get(output_key, [])
        if isinstance(videoList, list):
            for item in videoList:
                # file_path = os.path.join("output", item)
                result.append(
                    {
                        "type": OutputNodeType.Video,
                        "value": item,
                    }
                )

    return result, output_key
