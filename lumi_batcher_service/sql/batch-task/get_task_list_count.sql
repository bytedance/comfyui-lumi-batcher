SELECT
    count(*)
FROM
    batch_task
WHERE
    name LIKE ?
    AND (
        ? IS NULL
        OR batch_task.status IN (
            SELECT
                value
            FROM
                json_each (?)
        )
    )