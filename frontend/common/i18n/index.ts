// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later

import { LanguagesEnum, languageUtils } from '@common/language';
import { TranslationsType } from './type';
import { TranslationsDataDefault } from './translations';

const isDev = false;
let translationsData: TranslationsType = isDev ? {} : TranslationsDataDefault;
let loseTranslationData: TranslationsType = {};
export class I18n {
  static t(key: string, params: any, defaultText: string) {
    // 记录新键值（如果不存在）
    if (isDev && !translationsData[key]) {
      translationsData[key] = {
        [LanguagesEnum.EN]: defaultText,
        [LanguagesEnum.ZH]: defaultText,
      };
    }

    const language = languageUtils.getLanguage();
    const translationConfig = translationsData[key];
    let result = defaultText;

    if (!translationConfig) {
      loseTranslationData[key] = {
        [LanguagesEnum.EN]: defaultText,
        [LanguagesEnum.ZH]: defaultText,
      };
    } else {
      result = translationConfig[language];
    }

    if (params) {
      Object.keys(params).forEach((placeholder) => {
        const regex = new RegExp(`\\{${placeholder}\\}`, 'g');
        result = result.replace(regex, params[placeholder]);
      });
    }
    return result;
  }

  static getTranslationsData() {
    return JSON.stringify(translationsData);
  }

  static getLoseTranslationData() {
    return JSON.stringify(loseTranslationData);
  }
}

// 向 window 对象注册属性
// @ts-ignore
window.ComfyUILumiBatcherI18n = I18n;
