// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Comfy } from '@typings/comfy';
import requestClient, { apiPrefix } from './request-instance';

export interface CreatePromptTaskRequest {
  prompt: Comfy.WorkflowOutput;
  workflow: any;
  batch_task_id?: any;
  client_id?: string;
  number?: number;
}

/**
 * @description 创建批量任务
 */
export async function createPromptTask(data: CreatePromptTaskRequest) {
  const res = await requestClient.post<any>(`${apiPrefix}/prompt`, data);
  return res.data;
}
