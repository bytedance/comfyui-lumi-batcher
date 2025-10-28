// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type ColumnProps } from '@arco-design/web-react/es/Table';

import {
  type PreviewTableCellValueType,
  type PreviewTableDataType,
  type PreviewTableRowDataType,
} from '../type/table';
import { ResultItem, ResultOutputTypeEnum } from '@api/result';
import { create } from '@common/zustand';

export interface PreviewTableState {
  data: PreviewTableDataType;
  columnList: ColumnProps<PreviewTableRowDataType>[];
  currentRow: number;
  currentCol: number;
  preview: ResultItem[] | undefined;
  cellSize: number;
  observer: IntersectionObserver;
  lazyImgVisibleMap: Record<string, boolean>;
}

export interface PreviewTableAction {
  getCellValue: (row: number, col: number) => PreviewTableCellValueType;
  onCellPreview: (col: number, row: number) => void;
}

export const PreviewTableDefaultState = {
  data: [],
  columnList: [],
  currentRow: 0,
  currentCol: 0,
  preview: [],
  cellSize: 0,
  observer: new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const src = entry.target.getAttribute('data-src') ?? '';
          usePreviewTableStore.setState({
            lazyImgVisibleMap: {
              ...usePreviewTableStore.getState().lazyImgVisibleMap,
              [src]: true,
            },
          });
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    },
  ),
  lazyImgVisibleMap: {},
};

export const usePreviewTableStore = create<
  PreviewTableState,
  PreviewTableAction
>(PreviewTableDefaultState, (set, get) => ({
  getCellValue(row: number, col: number): PreviewTableCellValueType {
    const { data, columnList } = get();
    if (row >= 0 && row < data.length && col >= 0 && col < columnList.length) {
      const rowData = data[row];
      const column = columnList[col];
      return rowData[column.dataIndex as string] as PreviewTableCellValueType;
    }
    return [];
  },
  onCellPreview: (col: number, row: number) => {
    const { data, columnList } = get();
    if (row >= 0 && row < data.length && col >= 0 && col < columnList.length) {
      const rowData = data[row];
      const column = columnList[col];
      const value = rowData[
        column.dataIndex as string
      ] as PreviewTableCellValueType;
      const previewList: ResultItem[] = [];
      value
        .filter((i) => ['image', 'video'].includes(i.type))
        .forEach((value) =>
          value.value.forEach((i) =>
            previewList.push({
              type: value.type as ResultOutputTypeEnum,
              url: i,
            }),
          ),
        );

      if (previewList.length > 0) {
        set({
          preview: previewList,
          currentCol: col,
          currentRow: row,
        });
      }
    }
  },
}));
