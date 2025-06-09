CREATE TABLE
  IF NOT EXISTS resources (
    -- 绑定的批量任务id
    batch_task_id TEXT NOT NULL,
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_ext TEXT NOT NULL,
    create_time REAL NOT NULL,
    update_time REAL NOT NULL,
    -- 父任务id
    FOREIGN KEY (batch_task_id) REFERENCES batch_task (id)
  )