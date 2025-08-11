// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { v4 as uuidv4 } from 'uuid';

const generateOne = (len: number): number => {
  let res = '';
  // 生成UUID并提取数字部分，确保足够长度
  while (res.length < len) {
    // 生成UUID v4并移除连字符
    const uuid = uuidv4().replace(/-/g, '');
    // 遍历UUID的每个十六进制字符
    for (const char of uuid) {
      // 转换为十进制数字(0-15)后取模10得到0-9
      const digit = parseInt(char, 16) % 10;
      // 保持原逻辑：0替换为1，其他数字直接使用
      res += digit === 0 ? '1' : digit.toString();
      if (res.length === len) break;
    }
  }
  return Number(res);
};

/**
 * @desc 生成随机数算法
 * @param count 生成随机数数量
 * @returns 随机数数组
 */
export const randomSeed = (count: number): number[] => {
  const len = 8;
  const set = new Set<number>();

  const getOnlyOne = (): number => {
    const r = generateOne(len);
    if (set.has(r)) {
      return getOnlyOne();
    } else {
      set.add(r);
      return r;
    }
  };

  for (let i = 0; i < count; i++) {
    getOnlyOne();
  }

  return Array.from(set);
};
