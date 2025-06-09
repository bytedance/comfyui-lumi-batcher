UPDATE batch_sub_task
SET
    status = "cancelled",
    reason = "任务取消"
WHERE
    batch_task_id = ?