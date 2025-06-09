// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ResultItem, ResultOutputTypeEnum } from '@api/result';

/** 根据优先级获取输出结果内容 */
export const getDefaultDisplayResult = (
  results: ResultItem[] = [],
): ResultItem => {
  const weightList = [
    ResultOutputTypeEnum.Video,
    ResultOutputTypeEnum.Image,
    ResultOutputTypeEnum.Text,
  ];

  let foundItem = {
    type: ResultOutputTypeEnum.Text,
    url: '-',
  };

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < weightList.length; i++) {
    const item = weightList[i];
    const t = results.find((r) => r.type === item);
    if (t) {
      foundItem = t;
      break;
    }
  }

  return foundItem;
};
