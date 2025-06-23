// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ColumnTypeEnum } from '@common/constant/creator';
import { I18n } from '@common/i18n';
import { getExpressionValue } from '@common/utils/expression';
import { ValueTypeEnum } from '@common/utils/value-type';
import { ValueBaseType, NodeInfo } from '@src/create-task/utils/get-node-info';

/**
 * @description 处理单个数据转化
 * @param value 数据值
 * @param type 数据类型
 * @returns
 */
export const dataTransferSingle = (
  value: ValueBaseType,
  type: ValueTypeEnum,
): ValueBaseType => {
  let resValue = value;

  switch (type) {
    case ValueTypeEnum.NUMBER:
    case ValueTypeEnum.INT:
    case ValueTypeEnum.FLOAT:
      try {
        resValue = Number(resValue);
        if (isNaN(resValue)) {
          resValue = value;
        }
      } catch {
        resValue = value;
      }
      break;
    case ValueTypeEnum.STRING:
      resValue = String(value ?? '').trim();
      break;
    default:
      break;
  }

  return resValue;
};

/**
 * @description 处理数据转化
 * @param value 数据值
 * @param type 数据类型
 * @returns
 */
export const dataTransfer = (
  value: NodeInfo['paramValue'],
  type: ValueTypeEnum = ValueTypeEnum.STRING,
): ValueBaseType[] => {
  if (value instanceof Array) {
    const temp = value
      .filter((item) => item !== '')
      .map((item) => getExpressionValue(String(item)))
      .flat(1);
    return temp.map((item) => dataTransferSingle(item, type));
  } else {
    if (value) {
      return getExpressionValue(String(value))
        .map((item) => dataTransferSingle(item, type))
        .flat(1);
    }
    return [dataTransferSingle(value, type)];
  }
};

export const getPlaceholderText = (type: ColumnTypeEnum): string => {
  switch (type) {
    case ColumnTypeEnum.Image:
      return I18n.t(
        'support_multi_select_upload_or_zip_archive',
        {},
        '支持多选上传或Zip压缩包',
      );
    case ColumnTypeEnum.Text:
      return I18n.t(
        'you_can_add_or_upload_excel_in_batches_through__;_',
        {},
        '可通过“；”批量添加或上传Excel',
      );
    case ColumnTypeEnum.Number:
      return I18n.t(
        'you_can_add_or_upload_excel_in_batches_through__;__2',
        {},
        '可通过“；”批量添加或上传ExceL',
      );
    default:
      return I18n.t(
        'it_can_be_added_in_batches_through__;_',
        {},
        '可通过“；”批量添加',
      );
  }
};
