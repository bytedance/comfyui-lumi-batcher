SELECT
    *
FROM
    batch_task
WHERE
    json_extract ("package_info", '$.status') IN ('waiting', 'packing')