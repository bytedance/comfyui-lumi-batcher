// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
const generateOne = (len: number): number => {
  let res = '';
  for (let i = 0; i < len; i++) {
    const r = Math.floor(Math.random() * 10);
    if (r <= 0) {
      res += '1';
    } else {
      res += r.toString();
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
  const len = 15;
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
