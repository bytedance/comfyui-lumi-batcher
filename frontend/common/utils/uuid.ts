// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/** 获取唯一标识 */
export const uuid = () => {
  return Math.random().toString(16).split('.')[1];
};
