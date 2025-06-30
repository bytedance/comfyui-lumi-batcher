// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { apiPrefix } from '@api/request-instance';
import { SpecialOutputSuffix } from '@common/constant/params-config';
import { isString } from 'lodash';
import { getSpecialOutputValue } from './value-type';

const RE_IMAGE_SUFFIX =
  /\.(bmp|jpg|png|tif|gif|pcx|tga|exif|fpx|svg|psd|cdr|pcd|dxf|ufo|eps|ai|raw|WMF|webp|jpeg)$/;

export const isImage = (value: unknown) => {
  if (!isString(value)) {
    return false;
  }
  return RE_IMAGE_SUFFIX.test(value.toLowerCase());
};

/**
 * 获取输入图片预览链接
 */
export const getImageUrl = (fileName?: string) => {
  if (!fileName) {
    return '';
  }
  return `/view?filename=${fileName}&type=input`;
};

/**
 * 获取输入图片预览链接 V2
 */
export const getImageUrlV2 = (
  fileName?: string,
  type = 'output',
  useCache = true,
) => {
  if (!fileName) {
    return '';
  }
  const cache = useCache ? '' : `&cache=${Date.now()}}`;

  if (fileName?.endsWith(SpecialOutputSuffix)) {
    type = 'output';
    fileName = getSpecialOutputValue(fileName);
    return `${apiPrefix}/view-image?file_name=${encodeURIComponent(fileName)}&type=${type}${cache}`;
  }

  return `${apiPrefix}/view-image?file_name=${encodeURIComponent(fileName)}&type=${type}${cache}`;
};
