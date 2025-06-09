// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/**
 *
 * @returns 判断是否在iframe中
 */
export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // 如果访问 window.top 导致错误，说明在跨域的 iframe 中
    return true;
  }
};
