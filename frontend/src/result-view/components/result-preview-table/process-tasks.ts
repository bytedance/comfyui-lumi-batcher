// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import {
  type GetRoomResultsResponse,
  type TaskResultInfo,
} from '@/api/batch-task/result';
import { type ParamsConfigType } from '@/type/batch-task';

import { CommonSeparator, getKey } from './utils';

/** 用于存放序列化的key映射任务结果 */
export interface SerializedTaskResultMap {
  [key: string]: TaskResultInfo;
}

/** 用于存放序列化的key映射任务参数 */
export interface SerializedParamsConfigMap {
  [key: string]: Array<string>;
}
/**
 * 处理任务数据，将其序列化唯一key可索引的数据
 * @param tasks
 * @returns
 */
export const processTasks = (
  tasks: GetRoomResultsResponse['results'],
): {
  resultMap: SerializedTaskResultMap;
  configMap: SerializedParamsConfigMap;
} => {
  if (!tasks) {
    return { resultMap: {}, configMap: {} };
  }
  const res: SerializedTaskResultMap = {};
  const map: SerializedParamsConfigMap = {};

  tasks.forEach(task => {
    try {
      const paramsConfig: ParamsConfigType = JSON.parse(task.ParamsConfig);
      let serializedKey = '';
      const p = paramsConfig.filter(i => i.category !== 'system');
      const keys: string[] = [];

      p.forEach((item, index) => {
        const commonSeparator = index !== p.length - 1 ? CommonSeparator : '';
        let finalKey = '';
        if (item.type === 'group') {
          const { values } = item as any;
          values.forEach((v: any, i: number) => {
            const commonSeparator =
              i !== values.length - 1 ? CommonSeparator : '';
            const key = getKey(v as any, (v as any).value);
            finalKey += `${key}${commonSeparator}`;
            serializedKey += `${key}${commonSeparator}`;
          });
        } else {
          const key = getKey(item as any, (item as any).value);
          finalKey = key;
          serializedKey += `${key}${commonSeparator}`;
        }
        keys.push(finalKey);
      });
      res[serializedKey] = task;
      map[serializedKey] = keys;
    } catch (error) {
      // 如果报错，则认为是脏数据
      console.error(error);
    }
  });

  return {
    resultMap: res,
    configMap: map,
  };
};
