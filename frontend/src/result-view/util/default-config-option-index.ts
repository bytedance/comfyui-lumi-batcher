// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ConfigOption } from '@common/type/result';
import { concatKeys, isConfigOptionSimple, isIgnoreConfigOption } from '.';

/**
 * 跟据参数列表获取默认选中参数。
 * 选中参数列表中 internal_name === 'image' 的，或者兜底第一条。
 */
export function getDefaultConfigOptionIndex(configOptions: ConfigOption[]) {
  const imageConfigOptionIndex = configOptions
    .filter((item) => !isIgnoreConfigOption(item))
    .findIndex((item) =>
      isConfigOptionSimple(item)
        ? item.internal_name === 'image'
        : item.values.some((curr) => curr.internal_name === 'image'),
    );

  return imageConfigOptionIndex > -1 ? imageConfigOptionIndex : 0;
}

export const getTableConfigOptions = (tableConfigOptions: ConfigOption[]) =>
  tableConfigOptions
    .filter((item) => !isIgnoreConfigOption(item))
    .map((item) => {
      const key = concatKeys(item);
      return {
        label: key,
        value: key,
        extra: item,
      };
    });
