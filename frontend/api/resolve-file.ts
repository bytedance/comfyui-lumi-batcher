// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import requestClient, { apiPrefix } from './request-instance';

/**
 * @description 解析文件
 */
export async function resolveFile(data: FormData) {
  const res = await requestClient.post<any>(`${apiPrefix}/resolve-file`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}

/**
 * @description 上传文件
 */
export async function uploadFile(data: FormData) {
  const res = await requestClient.post<{
    data: {
      file_name: string;
    };
  }>(`${apiPrefix}/upload-file`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
}
