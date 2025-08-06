// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/** 获取唯一标识 */
import { v4 as uuidv4 } from 'uuid';

export const uuid = () => {
  return uuidv4();
};
