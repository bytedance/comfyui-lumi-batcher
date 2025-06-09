# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import contextvars
import queue
import threading
import time

# import weakref
import concurrent.futures
import traceback


class SharedContext:
    """通用python上下文管理器"""

    def __init__(self):
        # self._context = weakref.WeakValueDictionary()
        self._context = {}
        self._lock = threading.Lock()
        self._private_context = contextvars.ContextVar("private_context", default={})

    def set(self, key, value):
        with self._lock:
            # 更新全局上下文变量
            self._context[key] = value

    def set_local(self, key, value):
        with self._lock:
            # 更新线程局部的上下文变量
            current_context = self._private_context.get()
            current_context[key] = value
            self._private_context.set(current_context)

    def get(self, key, default=None):
        with self._lock:
            return self._context.get(key, default)

    def get_all(self):
        with self._lock:
            return dict(self._context)

    def get_thread_local(self, key, default=None):
        current_context = self._private_context.get()
        return current_context.get(key, default)

    def get_all_thread_local(self):
        return self._private_context.get()


class ThreadTaskManager:
    """带调度队列的任务线程执行并发管理器"""

    sharedContext = SharedContext()
    """单个任务调度器有一个自己的上下文，方便上下文管理"""

    def __init__(self, max_workers):
        self.task_queue = queue.Queue()
        self.max_workers = max_workers
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=max_workers)
        self.lock = threading.Lock()
        self.active_tasks = 0
        self.all_tasks_done = threading.Event()  # 新增事件对象

    def add_task(self, task, *args, **kwargs):
        self.task_queue.put((task, args, kwargs))
        self.all_tasks_done.clear()  # 重置事件状态
        self._schedule_next_task()

    def _schedule_next_task(self):
        with self.lock:
            if self.active_tasks < self.max_workers and not self.task_queue.empty():
                task, args, kwargs = self.task_queue.get()
                self.active_tasks += 1
                future = self.executor.submit(self._run_task, task, *args, **kwargs)
                future.add_done_callback(self._task_done)

    def _run_task(self, task, *args, **kwargs):
        try:
            task(*args, **kwargs)
        except Exception as e:
            print(f"Task error: {str(e).replace('%', '%%')}")  # 转义日志

    def _task_done(self, future: concurrent.futures.Future):
        try:
            future.result()
        except Exception as e:
            print(f"Task failed with exception: {str(e).replace('%', '%%')}")
        finally:
            with self.lock:
                self.active_tasks -= 1
                if self.active_tasks == 0 and self.task_queue.empty():
                    self.all_tasks_done.set()  # 设置完成事件
            self._schedule_next_task()

    def wait_for_all_tasks(self):
        """等待所有任务完成（带超时机制）"""
        self.all_tasks_done.wait(timeout=60 * 5)  # 5分钟超时
        if not self.all_tasks_done.is_set():
            raise TimeoutError("Tasks did not complete within timeout period")

    def shutdown(self, wait=True):
        self.executor.shutdown(wait=wait)


threadTaskManager = ThreadTaskManager(5)


def RunInThread(target: any, *args, **kwargs) -> threading.Thread:
    """干净的在线程独立执行函数的方法"""

    def executor():
        try:
            target(*args, **kwargs)
        except Exception as e:
            # 打印异常信息
            print(f"Exception in thread: {e}")
            traceback.print_exc()

    # 创建并启动线程
    thread = threading.Thread(target=executor)
    thread.start()

    # 返回线程对象
    return thread


def example_task(x):
    print(x)
    time.sleep(1)
    raise Exception()


def test():
    for i in range(100):
        threadTaskManager.add_task(example_task, i)

    time.sleep(3)

    for i in range(100):
        threadTaskManager.add_task(example_task, i)

    # threadTaskManager.shutdown(wait=True)
    time.sleep(3)


# test()
# threadTaskManager.wait_for_all_tasks()
# print("All tasks completed")
