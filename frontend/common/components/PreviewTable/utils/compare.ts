// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
// 自定义比较函数
export const customCompare = (original: any[], processed: any[]): boolean => {
  // 基础长度比较
  if (original.length !== processed.length) {
    return false;
  }

  // 深度比较每个元素的关键属性
  return original.every((item, index) => {
    const processedItem = processed[index];

    // 比较columns/data的关键标识属性
    const keyField = item.dataIndex ? 'dataIndex' : 'id';
    if (item[keyField] !== processedItem[keyField]) {
      return false;
    } else {
      return true;
    }
  });
};
