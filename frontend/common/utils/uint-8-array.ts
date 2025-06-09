// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export const combineUnit8Array = (arr: Uint8Array[]) => {
  // 计算组合后的数组的总长度
  const totalLength = arr.reduce((acc, curr) => acc + curr.length, 0);

  // 创建一个新的 Uint8Array，用于存储组合后的结果
  const combinedArray = new Uint8Array(totalLength);

  // 使用 set 方法将每个数组的内容复制到新的数组中
  let offset = 0;
  arr.forEach(array => {
    combinedArray.set(array, offset);
    offset += array.length;
  });

  return combinedArray;
};
