SELECT
  batch_task_with_pagination.id,
  batch_task_with_pagination.name,
  batch_task_with_pagination.create_time,
  batch_task_with_pagination.update_time,
  batch_task_with_pagination.queue_count,
  batch_task_with_pagination.params_config,
  batch_task_with_pagination.status,
  batch_task_with_pagination.status_counts,
  batch_task_with_pagination.package_info,
  batch_task_with_pagination.messages,
  batch_task_with_pagination.extra
FROM
  (
    SELECT
      batch_task.id,
      batch_task.name,
      batch_task.create_time,
      batch_task.update_time,
      batch_task.queue_count,
      batch_task.params_config,
      batch_task.status,
      batch_task.status_counts,
      batch_task.package_info,
      batch_task.messages,
      batch_task.extra
    FROM
      batch_task
    WHERE
      batch_task.name LIKE ?
      AND (
        ? IS NULL
        OR batch_task.status IN (
          SELECT
            value
          FROM
            json_each (?)
        )
      )
    ORDER BY
      batch_task.create_time DESC
    LIMIT
      ?
    OFFSET
      ?
  ) AS batch_task_with_pagination