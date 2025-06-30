// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { AllNodesOptions } from '@common/type/batch-task';
import {
  getSpecialOutputValue,
  RE_IMAGE_SUFFIX,
  RE_VIDEO_SUFFIX,
} from '@common/utils/value-type';
import { isNil, isNumber, isString } from 'lodash';

type ValueType = 'image' | 'text' | 'number' | 'video';

export function checkParamType(
  value?: AllNodesOptions[number]['paramsList'][number]['value'],
): ValueType {
  if (
    isString(value) &&
    RE_IMAGE_SUFFIX.test(getSpecialOutputValue(value.toLowerCase()))
  ) {
    return 'image';
  } else if (isString(value) && RE_VIDEO_SUFFIX.test(value.toLowerCase())) {
    return 'video';
  } else if (isNumber(value)) {
    return 'number';
  } else {
    return 'text';
  }
}

export function checkTaskParamType(
  allNodesOptions: AllNodesOptions,
  nodeId?: string | number,
  internal_name?: string,
): ValueType {
  if (isNil(nodeId) || isNil(internal_name)) {
    return 'text';
  }

  const nodeParamsList = allNodesOptions.find(
    (item) => item.id === nodeId,
  )?.paramsList;
  const value = nodeParamsList?.find(
    (item) => item.label === internal_name,
  )?.value;

  return checkParamType(value);
}

export function getParamOriginValue(
  allNodesOptions: AllNodesOptions,
  nodeId: string | number,
  internal_name: string,
) {
  const nodeParamsList = allNodesOptions.find(
    (item) => item.id === nodeId,
  )?.paramsList;
  return nodeParamsList?.find((item) => item.label === internal_name)?.value;
}
