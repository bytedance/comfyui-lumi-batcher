INSERT INTO
    batch_task (
        id,
        name,
        create_time,
        update_time,
        queue_count,
        status,
        params_config,
        status_counts,
        package_info,
        messages,
        extra
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);