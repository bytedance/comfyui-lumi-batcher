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

// 安全移除DOM节点的方法
export function safeRemoveChild(node: HTMLElement) {
  if (node && node.parentNode && node.parentNode.contains(node)) {
    node.parentNode.removeChild(node);
  } else if (node && node.remove) {
    // 现代浏览器支持直接remove方法
    node.remove();
  }
}
