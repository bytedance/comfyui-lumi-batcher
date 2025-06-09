# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import json
import os
import uuid


class JsonFileController:
    # JSON 文件路径
    json_file_path = "task_file.json"

    def __init__(self, file_name):
        self.json_file_path = file_name
        # 检查文件是否存在
        if not os.path.exists(self.json_file_path):
            # 如果文件不存在，创建一个空的 JSON 文件
            with open(self.json_file_path, "w", encoding="utf-8") as f:
                json.dump({}, f, ensure_ascii=False)

    def readJson(self):
        try:
            with open(self.json_file_path, "r") as json_file:
                return json.load(json_file)
        except FileNotFoundError:
            print("JSON file does not exist.")
            return {}
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return {}

    def updateJson(self, json_data, type="append"):
        file_origin_json = json_data
        if type == "append":
            file_origin_json = self.readJson()
            file_origin_json.update(json_data)
        elif type == "replace":
            file_origin_json = json_data
        else:
            file_origin_json = self.readJson()
            file_origin_json.update(json_data)

        with open(self.json_file_path, "w", encoding="utf-8") as f:
            json.dump(file_origin_json, f, ensure_ascii=False)

        print(file_origin_json)

    def updateJsonAttr(self, key, value):
        file_origin_json = self.readJson()
        if key != None:
            file_origin_json.get(key, None)
            file_origin_json[key] = value

        self.updateJson(file_origin_json)

    def getJsonAttr(self, key):
        json_data = self.readJson()

        if key in json_data:
            return json_data[key]
        else:
            return None

    def getJsonList(self):
        json_data = self.readJson()

        json_list = []

        for k, v in reversed(json_data.items()):
            json_list.append({"task_id": k, "task_name": v})

        return json_list
