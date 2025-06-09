UPDATE batch_sub_task
SET
    status = 'failed',
    reason = '房间重启导致任务失败'
WHERE
    status in ('running', 'pending')