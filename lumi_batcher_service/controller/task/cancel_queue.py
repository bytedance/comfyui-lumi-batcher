# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import asyncio
import server
import nodes

headers = {"Content-Type": "application/octet-stream"}


# 终止当前运行的任务
def interruptQueue():
    try:
        nodes.interrupt_processing()
    except Exception as e:
        print("interrupt queue item error", e)
        return []


# 清除房间内的所有任务
def clearQueue():
    try:
        server.PromptServer.instance.prompt_queue.wipe_queue()
    except Exception as e:
        print("clear queue list error", e)
        return []


# 删除指定任务
def deleteQueue(prompt_ids: list) -> bool:
    try:
        queue = server.PromptServer.instance.prompt_queue

        for id in prompt_ids:
            fn = lambda a: a[1] == id
            queue.delete_queue_item(fn)

        return True
    except Exception as e:
        print(f"删除队列项失败: {str(e)}")
        return False


# 获取当前正在运行的任务prompt_id
def getRunningQueue():
    try:
        current_queue = server.PromptServer.instance.prompt_queue.get_current_queue()

        result = ""

        for item in current_queue[0]:
            result = item[1]

        return result
    except Exception as e:
        print("get running queue error", e)
        return ""


async def cancel_queue(prompt_ids: list):
    print("cancel_queue", prompt_ids)
    loop = asyncio.get_running_loop()
    running = getRunningQueue()
    if running in prompt_ids:
        loop.run_in_executor(None, interruptQueue)

    loop.run_in_executor(None, deleteQueue, prompt_ids)
