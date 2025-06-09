// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * 资源获取胶水代码
 */

import { getImageUrlV2 } from './image';

export const processResource = (urlValue: string): string => {
  if (!urlValue) {
    return '';
  }
  const isStartHttp = urlValue.startsWith('http');
  if (isStartHttp) {
    return urlValue;
  } else {
    return getImageUrlV2(urlValue);
  }
};

export const processOutputUrl = (urlValue: string): string => {
  if (!urlValue) {
    return '';
  }
  const isStartHttp = urlValue.startsWith('http');
  if (isStartHttp) {
    return urlValue;
  } else {
    return getImageUrlV2(urlValue);
  }
};

export const processResourceUrl = (urlValue: string): string => {
  if (!urlValue) {
    return '';
  }
  const isStartHttp = urlValue.startsWith('http');
  if (isStartHttp) {
    return urlValue;
  } else {
    return getImageUrlV2(urlValue, 'resource');
  }
};

export const processDownloadUrl = (urlValue: string): string => {
  if (!urlValue) {
    return '';
  }
  const isStartHttp = urlValue.startsWith('http');
  if (isStartHttp) {
    return urlValue;
  } else {
    return getImageUrlV2(urlValue, 'download');
  }
};
