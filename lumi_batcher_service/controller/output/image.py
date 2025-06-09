# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import os
from .value import OutputNodeType


def process_save_image(ui):
    result = None
    output_key = "images"
    if output_key in ui:
        images = ui[output_key]
        if isinstance(images, list):
            for item in images:
                if result is None:
                    result = []
                result.append(
                    {
                        "type": OutputNodeType.Image,
                        "value": os.path.join(item["subfolder"], item["filename"]),
                    }
                )

    return result, output_key
