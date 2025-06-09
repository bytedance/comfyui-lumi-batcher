// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ConfigOption, ConfigOptionSimple } from '@common/type/result';

export * from './default-config-option-index';
export * from './unique-value-map';

/** 是否组合参数 */
export function isConfigOptionSimple(
  info: ConfigOption,
): info is ConfigOptionSimple {
  return info?.type !== 'group';
}

/** 拼接非组合参数 Name */
export function concatNames(
  info: Pick<ConfigOptionSimple, 'nodeId' | 'internal_name'>,
) {
  return `#${info.nodeId}:${info.internal_name}`;
}

/** 拼接参数 Name */
export function concatKeys(info: ConfigOption): string {
  if (isConfigOptionSimple(info)) {
    return concatNames(info);
  } else {
    return info.values.map((item) => concatKeys(item)).join(' + ');
  }
}

/** 判断此参数是否应该忽略 */
export function isIgnoreConfigOption(info: ConfigOption) {
  if (isConfigOptionSimple(info) && info.category === 'system') {
    return true;
  }
  return false;
}

/** 根据用户拖拽设置的百分比计算单元格实际显示尺寸 */
export function calcPercentSize(max: number, min: number, percentage: number) {
  return ((percentage - 50) * (max - min)) / 100 + min;
}
