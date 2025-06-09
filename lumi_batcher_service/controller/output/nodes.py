# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from . import default_output_class_type_list


def process_output_nodes(prompt: dict) -> list[int]:
    """
    获取默认的输出节点 id
    """
    allows_ids: list[str] = []
    for node_id in prompt:
        node = prompt[node_id]
        class_type = node.get("class_type", None)
        if class_type in default_output_class_type_list:
            allows_ids.append(node_id)

    return list(set(allows_ids))
