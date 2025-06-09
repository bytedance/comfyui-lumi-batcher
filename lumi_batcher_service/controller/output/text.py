# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import json
from .value import OutputNodeType


def process_pysssss_show_text(ui):
    result = None
    output_key = "text"
    if output_key in ui:
        text = ui[output_key]
        result = [{"type": OutputNodeType.Text, "value": json.dumps(text)}]

    return result, output_key
