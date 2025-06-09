# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import json


def process_output(result: list[dict]):
    """
    处理输出节点的输出
    """
    results = []

    for r in result:
        params_config = r.get("params_config", "")
        sub_task_id = r.get("id", "")
        output = json.loads(r.get("output", "[]"))
        outputs = []

        for o in output:
            values = o.get("values", [])
            if not values:
                continue

            for value in values:
                temp = {}
                value_type = value.get("type")
                current_value = value.get("value")
                if value_type in ["image", "video"]:
                    try:
                        value_id = current_value
                        cover_id = value.get("cover")

                        temp = {
                            "type": value_type,
                            "url": value_id,
                            "cover": cover_id,
                            "format": value.get("format"),
                            "value": value_id,
                        }

                    except Exception as e:
                        print(f"Error: {e}")
                        continue

                elif value_type == "text":
                    temp = {
                        "type": value_type,
                        "value": current_value,
                    }

                outputs.append(temp)

        results.append(
            {
                "ParamsConfig": params_config,
                "sub_task_id": sub_task_id,
                "list": outputs,
            }
        )

    return results
