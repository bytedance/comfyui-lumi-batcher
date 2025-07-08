// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Comfy } from '@typings/comfy';
import { ParamsConfigType } from '@common/type/batch-task';
import requestClient, { apiPrefix } from './request-instance';
import { PackageStatusEnum, TaskStatusEnum } from '@src/task-list/constants';
import { BatchTaskSceneEnum } from '@common/constant/batch';

export interface CreateBatchTaskRequest {
  client_id: string;
  prompt: Comfy.WorkflowOutput;
  workflow: any;
  auth_token_comfy_org: string;
  api_key_comfy_org: string;
  extra_data: {
    extra_pnginfo: {
      workflow: Comfy.GraphPrompt['workflow'];
    };
  };
  task_name: string;
  params_config: ParamsConfigType;
  number?: number;
}

/**
 * @description 创建批量任务
 */
export async function createBatchTask(data: CreateBatchTaskRequest) {
  const res = await requestClient.post<any>(
    `${apiPrefix}/batch-task/create`,
    data,
  );
  return res.data;
}

export interface TaskInfo {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  status_counts: {
    create_failed: number;
    waiting: number;
    failed: number;
    success: number;
    uploading: number;
    uploading_failed: number;
  };
  queue_count: number;
  params_config: string;
  extra: Record<string, any>;
  package_info: {
    result: string;
    status: PackageStatusEnum;
    message: string;
  };
  messages: string[];
  created_by: string;
  status: TaskStatusEnum;
  // 支持本地批量任务导入新增
  scene: BatchTaskSceneEnum;
  resources_map: Record<string, string>;
}

/**
 * @description 获取房间内任务列表（未来会支持筛选和分页）
 */
export async function getTaskList(
  taskName = '',
  pageSize = 10,
  offset = 0,
  status: TaskStatusEnum[] = [],
) {
  const res = await requestClient.get<{
    data: {
      data: Array<TaskInfo>;
      total: number;
    };
  }>(
    `${apiPrefix}/batch-task/list?` +
      `name=${taskName}&` +
      `page_size=${pageSize}&` +
      `page_num=${offset}&` +
      `status=${status}&` +
      'order_by=created_at desc',
  );
  return res.data;
}

/**
 * @description 取消任务
 */
export async function cancelTask(id: string) {
  const res = await requestClient.post<any>(`${apiPrefix}/batch-task/cancel`, {
    batch_task_id: id,
  });
  return res.data;
}

/**
 * @description 删除任务
 */
export async function deleteTask(id: string) {
  const res = await requestClient.post<any>(`${apiPrefix}/batch-task/delete`, {
    batch_task_id: id,
  });
  return res.data;
}

export const queuePrompt = async (
  number: number,
  output: any,
  workflow: any,
) => {
  const body: {
    client_id: string;
    prompt: string;
    extra_data: {
      extra_pnginfo: {
        workflow: any;
      };
    };
    front?: boolean;
    number?: number;
  } = {
    client_id: sessionStorage.getItem('clientId') ?? '',
    prompt: output,
    extra_data: { extra_pnginfo: { workflow } },
  };

  if (number === -1) {
    body.front = true;
  } else if (number !== 0) {
    body.number = number;
  }

  const res = await requestClient.post('/prompt', body);

  return res.data;
};

/**
 * @desc 更新任务名称接口
 * @param taskId 任务id
 * @param taskName 任务最新名称
 * @returns 接口执行结果
 */
export const updateTaskName = async (taskId: string, taskName: string) =>
  await requestClient.post(`${apiPrefix}/batch-task/update-name`, {
    batch_task_id: taskId,
    name: taskName,
  });

/** 获取任务详情 */
export const getTaskDetail = async (taskId: string) =>
  await requestClient.get<ApiResWrap<TaskInfo>>(
    `${apiPrefix}/batch-task/detail`,
    {
      params: { batch_task_id: taskId },
    },
  );
