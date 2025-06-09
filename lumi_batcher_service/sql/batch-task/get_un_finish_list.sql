SELECT
    *
FROM
    batch_task
WHERE
    status IN ('waiting', 'running')