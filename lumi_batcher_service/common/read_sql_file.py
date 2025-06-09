# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
def read_sql_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()
