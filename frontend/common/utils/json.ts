// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/**
 *
 * @param str json string
 * @param defaultValue 解析失败时候的默认值
 * @returns 自定义类型的json解析后的结果
 */
export const parseJsonStr = function <T>(str: string, defaultValue: T): T {
  let newValue: T;
  // 如果不是字符串，则直接返回原值
  if (typeof str !== 'string') {
    return str as T;
  }
  try {
    newValue = JSON.parse(str);
  } catch (e) {
    newValue = defaultValue as T;
  }
  return newValue;
};
