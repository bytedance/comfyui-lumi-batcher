// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type CSSProperties } from 'react';

const autoSuffixSet = new Set<keyof CSSProperties>([
  'width',
  'height',

  'top',
  'right',
  'bottom',
  'left',

  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',

  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',

  'maxWidth',
  'maxHeight',

  'fontSize',
]);
const transCamelToKebabCase = (name: string) => {
  const reg = /([A-Z])/g;
  return name.replace(reg, (val, char, index) => {
    if (index === 0) {
      return val.toLowerCase();
    }
    return `-${val.toLowerCase()}`;
  });
};
export const makeStyleToCSSText = (styleObj: CSSProperties) => {
  return Object.entries(styleObj).reduce((resText, [key, val]) => {
    let styleVal = val;
    if (
      typeof val === 'number' &&
      autoSuffixSet.has(key as keyof CSSProperties)
    ) {
      styleVal += 'px';
    }
    return `${resText}${transCamelToKebabCase(key)}:${styleVal};`;
  }, '');
};
