# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import json
import os
import sqlite3
import time

from ..common.read_sql_file import read_sql_file
from lumi_batcher_service.constant.task import CommonTaskStatus


class BatchTaskDao:
    db_file = ""
    sql_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sql/batch-task"
    )
    get_task_list_sql = read_sql_file(os.path.join(sql_dir, "get_task_list.sql"))
    get_task_list_count_sql = read_sql_file(
        os.path.join(sql_dir, "get_task_list_count.sql")
    )
    create_table_sql = read_sql_file(os.path.join(sql_dir, "create_table.sql"))

    def __init__(self, db_file):
        self.db_file = db_file
        self.create_table()

    def create_table(self):
        with sqlite3.connect(self.db_file) as conn:
            try:
                cursor = conn.cursor()
                sql = self.create_table_sql
                cursor.execute(sql)
                # 开启WAL模式
                conn.execute("PRAGMA journal_mode=WAL;")
                conn.commit()
                return
            except sqlite3.Error as e:
                print(f"An error occurred on create batch task table: {e.args[0]}")

    def insert_task(
        self,
        id: str,
        name: str,
        queue_count: int,
        status: str,
        params_config: str,
        status_counts: str,
        package_info: str,
        messages: str,
        extra: str,
    ):
        with sqlite3.connect(self.db_file) as conn:
            try:
                cursor = conn.cursor()
                sql = read_sql_file(os.path.join(self.sql_dir, "insert.sql"))
                now = int(time.time()) * 1000
                cursor.execute(
                    sql,
                    (
                        id,
                        name,
                        now,
                        now,
                        queue_count,
                        status,
                        params_config,
                        status_counts,
                        package_info,
                        messages,
                        extra,
                    ),
                )
                conn.commit()
                return cursor.lastrowid
            except sqlite3.Error as e:
                print(f"An error occurred on insert task: {e.args[0]}")
                return None

    def delete(self, id: str):
        with sqlite3.connect(self.db_file) as conn:
            try:
                cursor = conn.cursor()
                sql = read_sql_file(os.path.join(self.sql_dir, "delete.sql"))
                cursor.execute(sql, (id,))
                conn.commit()
                return True
            except sqlite3.Error as e:
                print(f"An error occurred on delete task: {e.args[0]}")
                return False

    def get_task_by_id(self, id):
        with sqlite3.connect(self.db_file) as conn:
            try:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                sql = read_sql_file(os.path.join(self.sql_dir, "get_task_detail.sql"))
                cursor.execute(sql, (id,))
                row = cursor.fetchone()
                return dict(row) if row else None
            except sqlite3.Error as e:
                print(f"An error occurred on get task by id: {e.args[0]}")

    def get_task_list(self, task_name="", status=None, page_size=10, offset=0):
        with sqlite3.connect(self.db_file) as conn:
            try:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                filter_name = f"%{task_name}%"
                filter_status = json.dumps(status.split(",")) if status else "[]"
                if status == "":
                    status = None
                cursor.execute(
                    self.get_task_list_sql,
                    (
                        filter_name,
                        status,
                        filter_status,
                        page_size,
                        offset,
                    ),
                )
                # 获取查询结果
                rows = cursor.fetchall()
                # 将查询结果转换为字典的列表
                dicts = [dict(row) for row in rows]
                result = []

                for row in dicts:
                    task_id = row["id"]
                    result.append(
                        {
                            "id": task_id,
                            "name": row["name"],
                            "created_at": row["create_time"],
                            "updated_at": row["update_time"],
                            "queue_count": row["queue_count"],
                            "status": row["status"],
                            "params_config": row["params_config"],
                            "status_counts": json.loads(row["status_counts"]),
                            "package_info": json.loads(row["package_info"]),
                            "messages": json.loads(row["messages"]),
                            "extra": json.loads(row["extra"]),
                        }
                    )

                cursor.execute(
                    self.get_task_list_count_sql,
                    (
                        filter_name,
                        status,
                        filter_status,
                    ),
                )

                conn.commit()
                count = cursor.fetchone()[0]

                return (result, count)
            except sqlite3.Error as e:
                print(f"An error occurred on getting task list v2: {e.args[0]}")
                return None

    def update_task_name(self, name: str, task_id: str):
        try:
            with sqlite3.connect(self.db_file) as conn:
                cursor = conn.cursor()

                sql = read_sql_file(os.path.join(self.sql_dir, "update_name.sql"))

                cursor.execute(sql, (name, task_id))

                conn.commit()

                return cursor.lastrowid
        except sqlite3.Error as e:
            print(f"An error occurred on update task name: {e.args[0]}")

    def update_property(self, task_id: str, property_name: str, property_value: str):
        try:
            with sqlite3.connect(self.db_file) as conn:
                cursor = conn.cursor()

                sql = ""

                if property_name == "status":
                    sql = read_sql_file(os.path.join(self.sql_dir, "update_status.sql"))
                elif property_name == "status_counts":
                    sql = read_sql_file(
                        os.path.join(self.sql_dir, "update_status_counts.sql")
                    )
                elif property_name == "package_info":
                    sql = read_sql_file(
                        os.path.join(self.sql_dir, "update_package_info.sql")
                    )
                elif property_name == "messages":
                    sql = read_sql_file(
                        os.path.join(self.sql_dir, "update_messages.sql")
                    )
                else:
                    raise Exception("Invalid property name")

                cursor.execute(sql, (property_value, task_id))

                conn.commit()

                return cursor.lastrowid
        except sqlite3.Error as e:
            print(f"An error occurred on update task property: {e.args[0]}")

    def update_on_reboot_room(self):
        with sqlite3.connect(self.db_file) as conn:
            try:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()

                sql = read_sql_file(
                    os.path.join(self.sql_dir, "get_un_finish_list.sql")
                )
                cursor.execute(sql)
                rows = cursor.fetchall()
                batch_task_ids = [row["id"] for row in rows]

                for batch_task_id in batch_task_ids:
                    batchTaskInfo = self.get_task_by_id(batch_task_id)
                    queue_count = batchTaskInfo.get("queue_count")
                    batch_task_status = batchTaskInfo.get("status")
                    status_counts = json.loads(batchTaskInfo.get("status_counts"))

                    success_count = status_counts.get(CommonTaskStatus.SUCCESS.value, 0)

                    if success_count == queue_count:
                        batch_task_status = CommonTaskStatus.SUCCESS.value
                    elif success_count > 0 & success_count < queue_count:
                        batch_task_status = CommonTaskStatus.PARTIAL_SUCCESS.value
                    else:
                        batch_task_status = CommonTaskStatus.FAILED.value

                    # 更新批量任务消息
                    messagesSet = set(json.loads(batchTaskInfo.get("messages", "[]")))
                    messagesSet.add("房间重启")

                    sql = read_sql_file(
                        os.path.join(self.sql_dir, "update_on_reboot.sql")
                    )

                    cursor.execute(
                        sql,
                        (
                            batch_task_status,
                            json.dumps(status_counts),
                            json.dumps(list(messagesSet)),
                            batch_task_id,
                        ),
                    )

                conn.commit()

                # 返回受影响的行数
                return cursor.rowcount
            except sqlite3.Error as e:
                print(f"An error occurred on update on reboot room: {e.args[0]}")

    def get_unpackage_list(self):
        with sqlite3.connect(self.db_file) as conn:
            try:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()

                sql = read_sql_file(
                    os.path.join(self.sql_dir, "get_unpackage_list.sql")
                )

                cursor.execute(sql)

                # 获取查询结果
                rows = cursor.fetchall()

                # 将查询结果转换为字典的列表
                dicts = [dict(row) for row in rows]

                conn.commit()

                # 返回受影响的行数
                return dicts
            except sqlite3.Error as e:
                print(f"An error occurred on get unpackage list: {e.args[0]}")
