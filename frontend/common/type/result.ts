// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export interface ConfigOptionSimple {
  category?: string;
  config_id: string;
  internal_name: string;
  name: string;
  nodeId: string;
  type: string;
  value: string | number;
  values: (string | number)[];
}

export type ConfigOption =
  | ConfigOptionSimple
  | {
      type: string;
      category?: string;
      values: ConfigOptionSimple[];
    };

// 预览模式
export type PreviewMode = 'table' | 'v-table';

// 通用描述参数值的类型
export type CommonParamValueType = 'string' | 'number' | 'image' | 'video';
