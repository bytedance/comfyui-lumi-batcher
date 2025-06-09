// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export type ParamsType =
  | 'string'
  | 'number'
  | 'image'
  | 'group'
  | 'data'
  | 'file';

export interface BaseParamsConfigType {
  type: ParamsType;
  /** 节点id，用于匹配节点 */
  nodeId: string | number | undefined;
  /** 参数名称，用于Excel统计中展示 */
  name: string;
  /** 参数在json内表现的字段名称 */
  internal_name: string | undefined;
  /** 配置id，用来标识当前配置 */
  config_id: string;
  /** 配置来源：system为系统添加，没有为用户自己添加 */
  category?: string;
  /** 数据集id，有数据集id，则认为是从数据集创建 */
  dataset_id?: string;
  /** 使用到的数据集中的列的id */
  column_id?: string;
}

export type StringParamsConfigType = BaseParamsConfigType & {
  type: 'string';
  values: string[];
};

export type NumberParamsConfigType = BaseParamsConfigType & {
  type: 'number';
  values: number[];
};

export type GroupParamsConfigType = BaseParamsConfigType & {
  type: 'group';
  values: ParamsConfigType;
};

export type DataParamsConfigType = BaseParamsConfigType & {
  type: 'data';
  values: any[];
};

export type FileParamsConfigType = BaseParamsConfigType & {
  type: 'file';
  values: any[];
};

export type ParamsConfigTypeItem =
  | StringParamsConfigType
  | NumberParamsConfigType
  | GroupParamsConfigType
  | FileParamsConfigType
  | DataParamsConfigType;

export type ParamsConfigType = Array<ParamsConfigTypeItem>;

export type AllNodesOptions = Array<{
  /** nodeId */
  id: number | string;
  /** nodeName */
  label: string;
  paramsList: Array<{
    label: string;
    value: string | number | (string | number | boolean)[];
    /** 标记是否是由连线上一个节点的输出所得 */
    isLinked: boolean;
  }>;
}>;
