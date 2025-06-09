UPDATE batch_task
SET
    status = ?,
    status_counts = ?,
    messages = ?
WHERE
    id = ?;