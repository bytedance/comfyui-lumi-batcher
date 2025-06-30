// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later

import { SpecialOutputSuffix } from '@common/constant/params-config';

/** 判断视频后缀的正则 */
export const RE_VIDEO_SUFFIX =
  /\.(mp4|avi|mov|wmv|flv|mkv|webm|mpeg|mpg|m4v|3gp|3g2|mxf|ogv|ts|vob)$/i;
/** 判断图片后缀的正则 */
export const RE_IMAGE_SUFFIX =
  /\.(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)$/;

/** 参数值类型推导 */
export enum ValueTypeEnum {
  IMAGE = 'image',
  INT = 'int',
  STRING = 'string',
  FLOAT = 'float',
  UNDEFINED = 'undefined',
  /** 数字类型 */
  NUMBER = 'number',
  VIDEO = 'video',
}

/** 获取传入值类型 */
export const getType = (value: any): ValueTypeEnum => {
  const lowerStr = String(value).toLowerCase();
  if (value === undefined) {
    return ValueTypeEnum.UNDEFINED;
  } else if (typeof value === 'number') {
    return ValueTypeEnum.NUMBER;
    // if (String(value).indexOf('.') !== -1) {
    //   return ValueTypeEnum.FLOAT;
    // } else {
    //   return ValueTypeEnum.INT;
    // }
  } else if (RE_IMAGE_SUFFIX.test(getSpecialOutputValue(lowerStr))) {
    return ValueTypeEnum.IMAGE;
  } else if (RE_VIDEO_SUFFIX.test(lowerStr)) {
    return ValueTypeEnum.VIDEO;
  } else if (typeof value === 'string') {
    return ValueTypeEnum.STRING;
  } else {
    return ValueTypeEnum.STRING;
  }
};

export const getSpecialOutputValue = (value: string) => {
  const v = String(value);
  if (String(v).endsWith(' [output]')) {
    return v.split(' [output]')[0];
  }
  return v;
};

export const buildSpecialOutputValue = (value: string) => {
  return `${value}${SpecialOutputSuffix}`;
};
