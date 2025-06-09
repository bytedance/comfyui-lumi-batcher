// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/** 批量工具上云后的任务状态枚举 */
export enum TaskStatusEnum {
  /** 批量任务排队 */
  Waiting = 'waiting',
  /** 生成中 */
  Running = 'running',
  /** 已失效 */
  Completed = 'completed',
  /** 失败 */
  Failed = 'failed',
  /** 部分成功 */
  PartiallySucceeded = 'partial_success',
  /** 完成 */
  Succeed = 'success',
  /** 已取消 */
  Canceled = 'cancelled',
  /** 已失效 */
  Dirty = 'dirty',
}

/** 批量任务在云端打包状态 */
export enum PackageStatusEnum {
  /** 打包排队中 */
  Waiting = 'waiting',
  /** 正在打包中 */
  Packing = 'packing',
  /** 打包成功 */
  Succeed = 'succeed',
  /** 打包失败 */
  Failed = 'failed',
}

/** 示例下载链接 */
export const DemoFileDownloadUrl =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupaonpmeh7nuhpeuhpa/batch-tools-sdk/local-batch-task-import-demo.zip';
