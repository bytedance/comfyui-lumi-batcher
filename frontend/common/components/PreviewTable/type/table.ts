// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { CommonParamValueType } from '@common/type/result';

export interface AtomValueType {
  label: string;
  status?: string;
  type: CommonParamValueType;
  value: string[];
}

export type PreviewTableCellValueType = Array<AtomValueType>;

export type PreviewTableRowDataType = {
  [k in string]: PreviewTableCellValueType;
};

export type PreviewTableDataType = Array<
  PreviewTableRowDataType & {
    id: string;
    filterKeys: string[];
  }
>;
