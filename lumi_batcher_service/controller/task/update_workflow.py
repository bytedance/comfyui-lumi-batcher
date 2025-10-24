import traceback


def update_workflow(workflow, old_prompt, config_item):
    config_type = config_item.get("type", "")
    values = config_item.get("values", [])
    if config_type == "group":
        for v in values:
            update_workflow(workflow, old_prompt, v)
    else:
        node_id = config_item.get("nodeId", "")
        internal_name = config_item.get("internal_name", "")
        value = config_item.get("value", "")
        category = config_item.get("category", "")

        if category == "system":
            # 系统参数不需要更新到 workflow 中
            return

        prompt_config = old_prompt.get(node_id, {})
        prompt_config_inputs = prompt_config.get("inputs", {})
        index = find_index_from_dict(prompt_config_inputs, internal_name)

        if index != -1 and "nodes" in workflow:
            node_info_index = -1
            # 查到到需要修改的wf
            for i, item in enumerate(workflow["nodes"]):
                if "id" in item and str(item["id"]) == node_id:
                    node_info_index = i
                    break
            if node_info_index != -1:
                try:
                    # 更新wf参数
                    workflow["nodes"][node_info_index]["widgets_values"][index] = value
                    node_info = workflow["nodes"][node_info_index]
                    if "type" in node_info and node_info["type"] == "BAComponent":
                        if "properties" in node_info:
                            properties = node_info["properties"]
                            if "ba-component-value" in properties:
                                comp_value = properties["ba-component-value"]
                                if internal_name in comp_value:
                                    workflow["nodes"][node_info_index]["properties"][
                                        "ba-component-value"
                                    ][internal_name] = value

                except Exception as e:
                    traceback.print_exc()
                    print(
                        f"警告: 更新 Node ID '{node_id}' 中的参数 '{internal_name}' 失败: {e}"
                    )
            else:
                print(f"警告: 在 workflow 中未找到 Node ID '{node_id}'，跳过更新。")


def find_index_from_dict(origin_dict: dict, property_to_match: str) -> int:
    if not isinstance(origin_dict, dict):
        print("错误：输入不是一个字典。")
        return -1

    for index, key_item in enumerate(origin_dict.keys()):
        if key_item == property_to_match:
            return index

    return -1
