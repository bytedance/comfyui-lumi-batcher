# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from lumi_batcher_service.constant.task import Category

# TODO: 暂不处理workflow中的参数值准确性，如果需要处理，则需要前端将节点更多的信息返回
# 需要处理的内容为 nodes --> id匹配的元素 --> 与internal_name相匹配的位置的widgets_values中的项  --> 修改其值为final_value
# simpleConfig: 简洁版的批量配置，这里不包含参数间的关系，仅描述什么节点配置了什么值


def updatePrompt(prompt, config_item, simpleConfig={}) -> dict[str, any]:
    # {
    #     "type": "string",
    #     "nodeId": "3",
    #     "internal_name": "seed",
    #     "name": "",
    #     "values": Array[2],
    #     "value": "1044772561400357"
    # },
    values = config_item["values"]

    if "type" in config_item:
        type = config_item["type"]
        if type == "group":
            for v in values:
                updatePrompt(prompt, v, simpleConfig)
        else:
            if (
                "nodeId" in config_item
                and "internal_name" in config_item
                and "value" in config_item
            ):
                nodeId, internal_name, value = (
                    config_item["nodeId"],
                    config_item["internal_name"],
                    config_item["value"],
                )
                category = config_item.get("category", Category.CUSTOM.value)
                final_value = value

                if type == "string":
                    final_value = str(final_value)
                elif type == "int":
                    final_value = int(float(final_value))
                elif type == "float":
                    final_value = float(final_value)
                # 如何使数据类型则直接透传
                elif type == "data":
                    final_value = value

                if final_value == None:
                    final_value = ""

                # 处理prompt中的参数
                if (
                    nodeId in prompt
                    and "inputs" in prompt[nodeId]
                    and internal_name in prompt[nodeId]["inputs"]
                ):
                    prompt[nodeId]["inputs"][internal_name] = final_value

                    if category != Category.SYSTEM.value:
                        simpleConfig[getSimpleConfigKey(nodeId, internal_name)] = str(
                            final_value
                        )

    return simpleConfig


def getSimpleConfigKey(nodeId, internal_name):
    return "#{}:{}".format(nodeId, internal_name)


def generateSimpleConfigDefault(params_config) -> dict[str, str]:
    def process_item(item):
        return (
            ((item["nodeId"], item["internal_name"]),)
            if item["type"] != "group"
            else ((c["nodeId"], c["internal_name"]) for c in item["values"])
        )

    return {
        getSimpleConfigKey(node_id, internal_name): ""
        for config_item in params_config
        if config_item.get("category", Category.CUSTOM.value) != Category.SYSTEM.value
        for node_id, internal_name in process_item(config_item)
    }
