// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/** 获取url中指定参数 */
export function getUrlParams(key: string): string {
  const reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`, 'i');
  // 获取url中"?"符后的字符串并正则匹配
  const r = window.location.search.substr(1).match(reg);
  let context = '';
  if (r !== null) {
    context = decodeURIComponent(r[2]);
  }
  return context ? context : '';
}
