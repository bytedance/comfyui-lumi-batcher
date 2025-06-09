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

/** 清空url中的参数 */
export const clearSearchParams = () => {
  // 去掉参数
  const urlWithoutParams = window.location.origin + window.location.pathname;

  // 使用 history.replaceState 更新URL
  window.history.replaceState({}, '', urlWithoutParams);
};

/** 清空url中的指定参数
 * @param paramsToRemove 要删除的参数列表
 */
export const deleteSearchParams = (paramsToRemove: string[]) => {
  // 获取当前URL
  const currentUrl = new URL(window.location.href);

  // 删除指定的参数
  paramsToRemove.forEach(param => currentUrl.searchParams.delete(param));

  // 使用 history.replaceState 更新URL
  window.history.replaceState({}, '', currentUrl.toString());
};
