INSERT INTO
    batch_sub_task (
        batch_task_id,
        id,
        prompt_id,
        create_time,
        update_time,
        params_config,
        status,
        reason,
        output
    )
VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?);