# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
from abc import ABC, abstractmethod
import asyncio
import threading
import time


class BaseThreadController(ABC):
    daemon_thread: threading.Thread
    time_interval: int = 5
    name = "base"
    running = True

    loop: asyncio.AbstractEventLoop

    def __init__(self, name: str):
        # 创建新的事件循环
        loop = asyncio.new_event_loop()
        self.loop = loop
        # 设置当前事件循环
        asyncio.set_event_loop(loop)

        # 创建守护线程, 并设置为守护线程
        self.daemon_thread = threading.Thread(target=self.setTimeInterval, daemon=True)
        # 启动守护线程
        self.daemon_thread.start()

    def setTime(self, time: int):
        self.time_interval = time

    def setTimeInterval(self):
        while self.running:
            self.execute()
            time.sleep(self.time_interval)

    @abstractmethod
    def execute(self):
        pass

    def stop(self):
        print(f"thread {self.name} has stopped")
        self.running = False
        # 关闭事件循环
        self.loop.close()
