---
name: knowledge-batch-task-lifecycle
description: >
  覆盖批量任务完整生命周期：参数叉乘创建、猴子补丁钩子追踪队列提交与执行、状态聚合状态机、队列中断取消、文件清理删除。
  导航时机：理解批量任务从创建到完成的全流程、调试端到端任务生命周期问题、修改任务状态转换、排查任务卡住、新增生命周期阶段或状态。
  排除：结果处理与输出媒体处理（见 ../result-processing/）、资源上传管理、前端UI逻辑。
  关键词: 批量任务生命周期, createBatchTask, cancelTask, deleteTask, post_prompt, task_start, task_done, BatchToolsHandler, SubTaskStatus, CommonTaskStatus, prompt_queue, 猴子补丁, 参数叉乘, 状态聚合, 队列执行, 文件清理, SQLite WAL。
---

## Module Structure

批量任务生命周期域管理ComfyUI批量处理任务的完整生命周期。它是一个ComfyUI自定义节点扩展，封装ComfyUI的prompt执行系统以支持参数化批量执行：用户配置参数组合，系统计算笛卡尔积生成多个prompt变体，提交到ComfyUI队列，通过猴子补丁钩子追踪执行，跨子任务聚合状态，处理取消和清理。

### Directory Layout
- `lumi_batcher_service/handler/batch_tools.py` — 核心API处理器（`BatchToolsHandler`单例），包含所有HTTP端点、参数叉乘引擎、prompt队列提交
- `lumi_batcher_service/hooks/` — 通过猴子补丁进行生命周期事件拦截
  - `task_start.py` — 拦截执行开始事件
  - `task_done.py` — 拦截执行完成、聚合状态、触发打包
  - `patch_wrpper.py` — 通用猴子补丁装饰器工具
- `lumi_batcher_service/controller/task/` — 任务操作控制器
  - `update_prompt.py` — 参数注入ComfyUI prompt图
  - `update_workflow.py` — 参数注入workflow UI表示
  - `cancel_queue.py` — 队列取消与中断逻辑
- `lumi_batcher_service/common/` — 共享工具
  - `validate_prompt.py` — Prompt校验兼容包装
  - `delete_file.py` — 异步并发文件删除
  - `file_path.py` — 路径安全白名单校验（被handler引用）
- `lumi_batcher_service/dao/` — SQLite数据访问层
  - `batch_task.py` — 批量任务CRUD与重启恢复
  - `batch_sub_task.py` — 子任务CRUD（含重试逻辑）
- `lumi_batcher_service/constant/task.py` — 状态枚举与数据类
- `lumi_batcher_service/thread/` — 后台线程
  - `task_scheduler_manager.py` — 线程执行工具
  - `check_status.py` — 后备状态轮询线程
- `__init__.py`（项目根目录）— 扩展入口点：实例化handler、注册钩子

### Key Entry Points
- `BatchToolsHandler.__init__()` 在 `lumi_batcher_service/handler/batch_tools.py` — 服务初始化、DB设置、路由注册、重启恢复
- `createBatchTask` POST `/api/comfyui-lumi-batcher/batch-task/create` — 任务创建API
- `cancelTask` POST `/api/comfyui-lumi-batcher/batch-task/cancel` — 任务取消API
- `deleteTask` POST `/api/comfyui-lumi-batcher/batch-task/delete` — 任务删除API
- 模块加载时注册钩子：`__init__.py`中的`batch_tools_task_start_hook()`、`batch_tools_task_done_hook()`

## Gotchas
- `BatchToolsHandler`通过`__init__`中设置的`instance = None`类变量使用单例模式，但没有强制保护——如果意外实例化两次，路由会被注册两次，钩子重复补丁自身，导致状态更新双重执行（`lumi_batcher_service/handler/batch_tools.py`）
- 服务重启恢复在`__init__`中**路由注册之前**运行，根据已记录的计数将所有未完成任务标记为SUCCESS/PARTIAL_SUCCESS/FAILED——但重启时已排队但从未开始的子任务（PENDING）不会从子任务表中清理，遗留孤儿记录（`lumi_batcher_service/handler/batch_tools.py`, `lumi_batcher_service/dao/batch_task.py`）
- 猴子补丁在模块导入时应用（ComfyUI加载自定义节点时），这意味着它们在整个ComfyUI进程生命周期中持续存在——不重启ComfyUI重新加载扩展会导致已补丁方法被再次包装，形成嵌套包装器链，造成原始逻辑被多次调用（`__init__.py`, `lumi_batcher_service/hooks/patch_wrpper.py`）
- 任务创建中的`number`参数控制队列优先级：`-1`插入队首，数值设置优先级，但post_prompt仅在未提供显式number时才递增`server.PromptServer.instance.number`——如果批量中所有任务都使用显式number，服务端计数器不会前进，可能导致number冲突（`lumi_batcher_service/handler/batch_tools.py`）
- 批量任务状态聚合是事件驱动的（task_done钩子）而非轮询，如果钩子遗漏事件（例如异常或任务在钩子注册前完成），批量任务可能永久卡在RUNNING或WAITING状态；check_status线程作为后备存在，但从不同模块路径（`lib.comfy_patch.batch_tools_patch`）导入，表明存在遗留/双代码路径（`lumi_batcher_service/thread/check_status.py`）
- 任务创建后的资源上传在发射后不管（fire-and-forget）线程中运行，没有错误传播——如果上传失败，批量任务在没有关联资源（图片等）的情况下继续执行，可能导致子任务执行失败但表现为通用ComfyUI错误（`lumi_batcher_service/handler/batch_tools.py`）
- 批量任务的`extra`字段将`output_nodes`和原始`prompt`存储为JSON——这在task_done时用于解析输出，但如果prompt很大（复杂工作流常见），由于prompt也嵌入在每条子任务记录中，每批量任务的存储量翻倍（`lumi_batcher_service/handler/batch_tools.py`）

## Architecture
- 该扩展作为ComfyUI自定义节点集成，通过ComfyUI的`PromptServer.instance.routes`装饰器在`/api/comfyui-lumi-batcher/`下注册HTTP路由——不启动独立Web服务器（`lumi_batcher_service/handler/batch_tools.py`）
- 生命周期追踪使用猴子补丁（非官方ComfyUI扩展API），因为ComfyUI不暴露执行事件的插件钩子；补丁用try/except/finally包装`PromptServer.send_sync`（WebSocket消息）和`PromptQueue.task_done`（执行完成），确保原始行为始终被保留（`lumi_batcher_service/hooks/task_start.py`, `lumi_batcher_service/hooks/task_done.py`）
- 两级任务模型：BatchTask（顶层，每次用户创建请求一个）包含N个BatchSubTasks（每个参数组合一个），通过`batch_task_id`关联；子任务与ComfyUI prompt_id 1:1映射（`lumi_batcher_service/dao/batch_task.py`, `lumi_batcher_service/dao/batch_sub_task.py`）
- 数据持久化使用SQLite WAL模式支持并发读写；数据库文件`batch_tools.db`存储在`WorkSpaceManager`管理的工作空间目录下`comfyui_lumi_batcher_workspace/db/`（`lumi_batcher_service/handler/batch_tools.py`）
- 参数组合引擎使用`itertools.product`对参数维度做叉乘，"group"类型支持类似zip的并行参数绑定（组内参数联动变化，非独立叉乘）（`lumi_batcher_service/handler/batch_tools.py`）
- 工作空间目录在启动时初始化：resources（上传文件）、db（SQLite）、download（打包结果）、upload（临时上传）——全部由`WorkSpaceManager`管理，抽象化文件系统路径（`lumi_batcher_service/handler/batch_tools.py`）

## Patterns
- 所有HTTP端点遵循一致模式：try/except包装，异常时返回`web.json_response`和`getErrorResponse(e, "操作失败")`；顶部解析请求、中间DAO调用、末尾构建响应（`lumi_batcher_service/handler/batch_tools.py`）
- 数据库访问使用上下文管理器（`with sqlite3.connect(...)`）管理连接生命周期，SQL语句通过`read_sql_file()`从外部`.sql`文件加载——SQL不内嵌在Python代码中（`lumi_batcher_service/dao/batch_task.py`, `lumi_batcher_service/dao/batch_sub_task.py`）
- 同步钩子中的异步操作使用新事件循环（`asyncio.new_event_loop()`）或线程执行器（`run_in_executor`、`RunInThread`），因为ComfyUI执行路径是同步的而文件I/O和打包是异步的（`lumi_batcher_service/hooks/task_done.py`, `lumi_batcher_service/thread/task_scheduler_manager.py`）
- 所有文件读/写/删除操作前通过白名单函数（`is_under_delete_white_dir`、`is_under_lumi_batcher`）强制路径安全，防止跨所有文件服务端点的路径遍历攻击（`lumi_batcher_service/handler/batch_tools.py`）
- 在叉乘循环的每次参数注入前，对prompt和workflow模板使用深拷贝（`copy.deepcopy`），防止跨迭代修改模板（`lumi_batcher_service/handler/batch_tools.py`）

## Conventions
- API路由通过`getApiPath()`辅助函数以`/api/comfyui-lumi-batcher`前缀注册，遵循REST风格路径：`/batch-task/create`、`/batch-task/cancel`、`/batch-task/delete`、`/batch-task/list`、`/batch-task/detail`、`/batch-task/result`（`lumi_batcher_service/handler/batch_tools.py`）
- 状态枚举使用字符串值（如`"running"`、`"success"`）而非整数，简化JSON序列化；CommonTaskStatus（批量）和SubTaskStatus（子任务）共享相同的终态字符串（`lumi_batcher_service/constant/task.py`）
- 猴子补丁包装器遵循一致模式：解包args/kwargs、检查相关消息类型、执行记录逻辑、在finally块中调用原始函数以保证ComfyUI行为永不被破坏（`lumi_batcher_service/hooks/task_start.py`, `lumi_batcher_service/hooks/task_done.py`）
- SQL文件镜像DAO方法名：`insert.sql`、`delete.sql`、`update_status.sql`、`get_task_by_prompt_id.sql`等，存储在`sql/batch-task/`和`sql/batch-sub-task/`目录下（`lumi_batcher_service/dao/batch_task.py`, `lumi_batcher_service/dao/batch_sub_task.py`）

## Dependencies
- 深度集成ComfyUI内部：`server.PromptServer`用于路由注册和队列访问、`execution.validate_prompt`用于prompt校验、`execution.SENSITIVE_EXTRA_DATA_KEYS`用于auth token处理、`nodes.interrupt_processing`用于取消、`folder_paths`用于输出目录解析
- 使用aiofiles进行异步文件I/O，aiohttp作为Web框架（继承自ComfyUI）
- SQLite持久化（标准库，无外部ORM），启用WAL日志模式
- 该扩展假定作为ComfyUI自定义节点从`custom_nodes/`目录加载——项目根的`__init__.py`按ComfyUI自定义节点约定导出`NODE_CLASS_MAPPINGS`、`NODE_INSTANCE_MAPPINGS`和`WEB_DIRECTORY`（`__init__.py`）

## State Machine
- 批量任务生命周期：WAITING（已创建，无子任务完成）→ RUNNING（部分子任务完成）→ SUCCESS（全部子任务成功）/ FAILED（全部失败/取消/创建失败）/ PARTIAL_SUCCESS（成功与失败混合）/ CANCELLED（用户取消）
- 子任务生命周期：PENDING（排队中）→ RUNNING（收到execution_start）→ SUCCESS / FAILED / CANCELLED；CREATE_FAILED是子任务在入队前验证失败时的预队列状态
- 状态转换在`task_done`钩子中通过统计已完成子任务数相对于总`queue_count`计算；到终态（SUCCESS/PARTIAL_SUCCESS/FAILED/CANCELLED）的转换不可逆转——一旦终态，迟到结果被忽略
- 取消是即时的（DB状态更新）但异步的（队列清理由后台线程执行）；取消后触发打包以提供部分结果下载
- 重启恢复将未完成任务转换为终态，不执行剩余子任务——ComfyUI内存队列在重启时丢失，PENDING子任务被遗弃（`lumi_batcher_service/dao/batch_task.py`, `lumi_batcher_service/dao/batch_sub_task.py`）

## Child Knowledge Nodes
- `./task-creation-params/SKILL.md` — 导航时机：修改参数叉乘逻辑、调试prompt/workflow注入、排查任务创建失败、新增参数类型
- `./task-queue-execution/SKILL.md` — 导航时机：调试任务状态转换、修改生命周期钩子、排查任务卡住、理解状态机行为
- `./task-cancel-delete/SKILL.md` — 导航时机：实现取消、调试队列中断、新增文件清理逻辑、理解路径安全机制
