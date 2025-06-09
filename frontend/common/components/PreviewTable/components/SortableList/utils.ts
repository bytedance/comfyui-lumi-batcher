// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export function arrayMove<ValueType>(
  array: readonly ValueType[],
  fromIndex: number,
  toIndex: number,
): ValueType[] {
  // 边界检查
  if (
    fromIndex < 0 ||
    fromIndex >= array.length ||
    toIndex < 0 ||
    toIndex >= array.length
  ) {
    return [...array];
  }

  // 创建新数组
  const newArray = [...array];
  // 移除源位置元素
  const [removed] = newArray.splice(fromIndex, 1);
  // 插入到目标位置
  newArray.splice(toIndex, 0, removed);

  return newArray;
}
