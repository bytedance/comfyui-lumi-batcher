// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { TaskResultInfo, ResultOutputTypeEnum, ResultItem } from '@api/result';
import { PreviewTableCellValueType } from '@common/components/PreviewTable/type/table';
import { CommonParamValueType } from '@common/type/result';
import { processOutputUrl } from '../process-resource';

// 处理结果数据转换成表格单元格数据
export const processResult = (
  info: TaskResultInfo,
): PreviewTableCellValueType => {
  const res: PreviewTableCellValueType = [];
  [
    ResultOutputTypeEnum.Image,
    ResultOutputTypeEnum.Text,
    ResultOutputTypeEnum.Video,
  ].forEach((type) => {
    const temp = info.list.filter((v) => v.type === type);
    if (temp.length > 0) {
      res.push({
        label: '',
        type: transferResultValueType(type),
        value: temp.map((v) => getValue(v)),
      });
    }
  });
  return res;
};

// 处理结果类型转换成表格类型
export const transferResultValueType = (
  type: ResultOutputTypeEnum,
): CommonParamValueType => {
  if (type === ResultOutputTypeEnum.Image) {
    return 'image';
  } else if (type === ResultOutputTypeEnum.Video) {
    return 'video';
  } else if (type === ResultOutputTypeEnum.Text) {
    return 'string';
  } else {
    return 'string';
  }
};

// 获取当前展示的值
export const getValue = (
  info: ResultItem,
  noProcessResource = false,
): string => {
  let res = '';
  try {
    if (
      info.type === ResultOutputTypeEnum.Image ||
      info.type === ResultOutputTypeEnum.Video
    ) {
      res = noProcessResource ? info.url : processOutputUrl(info.url);
    } else if (info.type === ResultOutputTypeEnum.Text) {
      res = info.value ? JSON.parse(info.value).join(',') : (info.value ?? '');
    } else {
      res = info.value ?? '';
    }
  } catch (error) {
    console.error(error);
    res = '';
  }
  return res;
};

// 获取源数据的值
export const getOriginValue = (info: ResultItem): string => {
  let res = '';
  try {
    if (
      info.type === ResultOutputTypeEnum.Image ||
      info.type === ResultOutputTypeEnum.Video
    ) {
      res = info.uri ?? '';
    } else if (info.type === ResultOutputTypeEnum.Text) {
      res = info.value ?? '';
    } else {
      res = info.value ?? '';
    }
  } catch (error) {
    console.error(error);
    res = '';
  }
  return res;
};
