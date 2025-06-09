// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export const createWithPrefix =
  (prefix: string) =>
  (suffix?: string): string => {
    if (!suffix) {
      return prefix;
    }
    return `${prefix}-${suffix}`;
  };
