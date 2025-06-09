# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
def getAuth(headers: dict = {}) -> dict:
    return {
        "Cookie": headers.get("Cookie", ""),
        "x-jwt-token": headers.get("x-jwt-token", ""),
        "x-tt-env": headers.get("x-tt-env", ""),
    }
