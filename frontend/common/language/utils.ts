// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { languageConfigMap, LanguagesEnum } from './config';
import { type TranslateKeys } from './key';

export const languageStorageKey = 'comfyui-lumi-batcher-language';

export class LanguageUtils {
  language: LanguagesEnum;

  constructor() {
    this.language = this.getLanguage();
  }

  getLanguage(): LanguagesEnum {
    return (
      (window.localStorage.getItem(
        languageStorageKey,
      ) as LanguagesEnum | null) || LanguagesEnum.EN
    );
  }

  setLanguage(language: LanguagesEnum): void {
    window.localStorage.setItem(languageStorageKey, language);
  }

  setRuntimeLanguage(language: LanguagesEnum) {
    this.language = language;
  }

  getText(key: TranslateKeys): string {
    return languageConfigMap[key][this.language];
  }
}

export const languageUtils = new LanguageUtils();
