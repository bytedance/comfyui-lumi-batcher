UPDATE batch_task
SET
    queue_count = ?
where
    id = ?