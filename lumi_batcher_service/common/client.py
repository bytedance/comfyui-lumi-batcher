# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from aiohttp import ClientSession

# 未来可以逐步拓展请求工具库


async def post(url, data, **kwargs):
    async with ClientSession() as session:
        async with session.post(url, json=data, **kwargs) as response:
            data = await response.json()

            return data


async def get(url, params={}, **kwargs):
    async with ClientSession() as session:
        async with session.get(url, params=params, **kwargs) as response:
            data = await response.json()

            return data


async def post_octet_stream(url, data, **kwargs):
    async with ClientSession() as session:
        async with session.post(url, data=data, **kwargs) as response:
            data = await response.text()

            return data


origin = "http://localhost:8188"


def get_origin():
    return origin


def set_origin(new_value):
    global origin
    if new_value.endswith("/"):
        origin = new_value[:-1]
    else:
        origin = new_value
