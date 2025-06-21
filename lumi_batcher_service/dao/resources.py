# Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
# SPDX-License-Identifier: GPL-3.0-or-later
import os
import sqlite3
import time
from ..common.read_sql_file import read_sql_file


class ResourcesDao:
    db_file = ""
    sql_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "sql/resources",
    )

    def __init__(self, db_file):
        self.db_file = db_file
        self.create_table()

    def create_table(self):
        with sqlite3.connect(self.db_file) as conn:
            try:
                cursor = conn.cursor()
                sql = read_sql_file(os.path.join(self.sql_dir, "create_table.sql"))
                cursor.execute(sql)
                # 开启WAL模式
                conn.execute("PRAGMA journal_mode=WAL;")
                conn.commit()
                return
            except sqlite3.Error as e:
                print(f"An error occurred on create resources table: {e.args[0]}")

    def insert(self, batch_task_id, id, type, file_name, file_ext):
        max_retries = 5
        retry_delay = 1

        for attempt in range(max_retries):
            with sqlite3.connect(self.db_file) as conn:
                try:
                    cursor = conn.cursor()
                    sql = read_sql_file(os.path.join(self.sql_dir, "insert.sql"))
                    now = int(time.time()) * 1000
                    cursor.execute(
                        sql,
                        (
                            batch_task_id,
                            id,
                            type,
                            file_name,
                            file_ext,
                            now,
                            now,
                        ),
                    )
                    conn.commit()
                    return cursor.lastrowid
                except sqlite3.OperationalError as e:
                    if "database is locked" in str(e):
                        print(
                            f"Database is locked, retrying in {retry_delay} seconds..."
                        )
                        time.sleep(retry_delay)
                    else:
                        print(f"An operational error occurred on insert resource: {e}")
                        raise
                except sqlite3.Error as e:
                    print(f"An error occurred on insert resource: {e.args[0]}")
                    return None
        print("Failed to insert resource after multiple retries")
        return False

    def delete(self, batch_task_id: str):
        with sqlite3.connect(self.db_file) as conn:
            try:
                cursor = conn.cursor()
                sql = read_sql_file(os.path.join(self.sql_dir, "delete.sql"))
                cursor.execute(sql, (batch_task_id,))
                conn.commit()
                return True
            except sqlite3.Error as e:
                print(f"An error occurred on delete resource: {e.args[0]}")
                return False

    def get_result(self, batch_task_id: str):
        with sqlite3.connect(self.db_file) as conn:
            try:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                sql = read_sql_file(os.path.join(self.sql_dir, "get_result.sql"))
                cursor.execute(sql, (batch_task_id,))
                # 获取查询结果
                rows = cursor.fetchall()
                conn.commit()
                # 将查询结果转换为字典的列表
                dicts = [dict(row) for row in rows]
                return dicts
            except sqlite3.Error as e:
                print(f"An error occurred on get sub tasks: {e.args[0]}")
                return None
