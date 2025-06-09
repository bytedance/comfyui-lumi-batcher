// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { getType, ValueTypeEnum } from '@common/utils/value-type';
import { Comfy } from '@typings/comfy';

/** 获取当前输入项的上传限制配置 */

export const getUploadAccept = (value: any): string => {
  const type = getType(value);
  const zipSuffix = '.zip';

  if (type === ValueTypeEnum.IMAGE) {
    return `${zipSuffix}, .bmp, .jpg, .png, .tif, .gif, .pcx, .tga, .exif, .fpx,
    .svg, .psd, .cdr, .pcd, .dxf, .ufo, .eps, .ai, .raw, .WMF, .webp, .jpeg`;
  } else if (type === ValueTypeEnum.VIDEO) {
    return `${zipSuffix}, .mp4, .avi, .mov,`;
  } else {
    return '.xls, .xlsx, .txt';
  }
};

export type ValueBaseType = string | number | boolean | undefined;

/** 节点信息 */
export interface NodeInfo {
  key: string;
  paramValue: ValueBaseType | Array<ValueBaseType>;
  paramType: ValueTypeEnum;
  paramOptions: Array<ValueBaseType>;
  uploadAccept: string;
  isSeed: boolean;
  nodeInfo: Comfy.Node | null;
}

/** 获取节点信息 */
export const getNodeInfo = (
  nodeId: string | number | undefined,
  internal_name: string | undefined,
): NodeInfo => {
  if (!nodeId) {
    return {} as NodeInfo;
  }

  const nodeInfo = window.app.graph.getNodeById(nodeId);

  const paramsInfo = nodeInfo?.widgets.find(
    // @ts-ignore
    (widget) => widget.name === internal_name,
  );

  const paramValue = paramsInfo?.value as any;

  const paramOptions = (paramsInfo?.options?.values ??
    []) as Array<ValueBaseType>;

  const isControlAfterGenerate = Boolean(
    paramsInfo?.linkedWidgets?.some(
      // @ts-ignore
      (item) => item.name === 'control_after_generate',
    ),
  );

  const paramType = getType(paramValue);

  console.log('nodeInfo', nodeInfo);

  return {
    key: `${nodeId}_${internal_name}`,
    paramValue,
    paramType,
    paramOptions,
    uploadAccept: getUploadAccept(paramValue),
    isSeed: isControlAfterGenerate,
    nodeInfo,
  };
};

/**
 * @desc 判断当前值的类型是否正确
 * @param value 要判断的数据值
 * @param type 要判断的数据类型
 * @returns 类型匹配是否成功
 */
export const validateValueType = (
  value: ValueBaseType,
  type: ValueTypeEnum,
): boolean => getType(value) === type;

/** 获取节点信息key */
export const getNodeInfoKey = (config: ParamsConfigTypeItem): string =>
  `${config?.nodeId}_${config?.internal_name}`;
