// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ConfigOptionSimple } from '@common/type/result';
import { RE_IMAGE_SUFFIX, RE_VIDEO_SUFFIX } from '@common/utils/value-type';

// 通用参数配置分隔符
export const CommonSeparator = '+';

// 从参数配置中获取key
export const getKey = (c: ConfigOptionSimple, v = '') =>
  `#${c.nodeId}:${c.internal_name}${v !== '' ? `=${v}` : ''}`;

// 从数据集图片路径中取文件key
export const getImageKey = (s: string): string => s.split('/').pop() ?? '';

export const getRenderCellType = (s: string) => {
  const lower = s.toLowerCase();
  if (RE_VIDEO_SUFFIX.test(lower)) {
    return 'video';
  } else if (RE_IMAGE_SUFFIX.test(lower)) {
    return 'image';
  } else {
    return 'string';
  }
};

export const getRenderCellValue = (
  t: string,
  o: string | number,
  rs: string,
) => {
  if (['image', 'video'].includes(t) && rs) {
    return rs;
  } else {
    return o;
  }
};
