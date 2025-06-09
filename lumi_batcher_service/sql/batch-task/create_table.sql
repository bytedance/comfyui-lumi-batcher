CREATE TABLE
  IF NOT EXISTS batch_task (
    -- 创建任务时，生成的唯一id
    id TEXT PRIMARY KEY,
    -- 任务名称
    name TEXT NOT NULL,
    -- 创建任务时间（时间戳）
    create_time REAL NOT NULL,
    -- 更新时间
    update_time REAL NOT NULL,
    -- 当前任务对应的叉乘批量调用数量
    queue_count INTEGER NOT NULL,
    -- 任务状态
    status TEXT NOT NULL,
    -- 当前任务对应的参数配置
    params_config TEXT NOT NULL,
    -- 任务状态数量map
    -- status_counts: {
    --   create_failed: number;
    --   waiting: number;
    --   failed: number;
    --   success: number;
    --   uploading: number;
    --   uploading_failed: number;
    -- }
    status_counts TEXT NOT NULL,
    -- 打包信息
    -- package_info: {
    --   result: string;
    --   status: PackageStatusEnum;
    --   message: string;
    -- };
    package_info TEXT NOT NULL,
    -- 错误信息
    messages TEXT NOT NULL,
    -- 存放一些额外的信息
    extra TEXT NOT NULL
    -- {
    --   output_nodes: int[];
    -- }
  )