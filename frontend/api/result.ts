// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import requestClient, { apiPrefix } from './request-instance';

/** 结果输出类型 */
export enum ResultOutputTypeEnum {
  Video = 'video',
  Image = 'image',
  Text = 'text',
}
export interface ResultItem {
  type: ResultOutputTypeEnum;
  url: string;
  format?: string;
  cover?: string;
  uri?: string;
  // 未来值的展示均用词字段
  value?: string;
}

export interface TaskResultInfo {
  ParamsConfig: string;
  img_urls: string[];
  list: ResultItem[];
  sub_task_id: string;
  task_perf_id: string;
  status: string;
  reason: string;
}

export interface GetRoomResultsResponse {
  total: number;
  resourcesMap: Record<string, string>;
  results: TaskResultInfo[] | null;
}

/**
 * 获取任务详情, withDetail 为 true 时，返回结果详情
 */
export async function getRoomResults(taskId: string) {
  const res = await requestClient.get<ApiResWrap<GetRoomResultsResponse>>(
    `${apiPrefix}/batch-task/result?batch_task_id=${taskId}`,
  );
  return res.data.data;
}
