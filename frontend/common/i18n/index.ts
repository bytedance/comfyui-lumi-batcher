// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
const translations: Record<string, string> = {};

export class I18n {
  static t(key: string, params: any, defaultText: string) {
    let result = translations[key] || defaultText;

    if (params) {
      Object.keys(params).forEach((placeholder) => {
        const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
        result = result.replace(regex, params[placeholder]);
      });
    }

    return result;
  }
}

// 向 window 对象注册属性
// @ts-ignore
window.BatchToolsI18n = I18n;
