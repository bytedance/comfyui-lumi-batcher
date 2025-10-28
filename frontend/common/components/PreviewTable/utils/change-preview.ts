// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { usePreviewTableStore } from '../store';

export const AcceptKeyCodeList = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
];

export const changePreview = (code: string) => {
  try {
    let { currentCol: col, currentRow: row } = usePreviewTableStore.getState();
    switch (code) {
      case 'ArrowUp':
        row -= 1;
        break;
      case 'ArrowDown':
        row += 1;
        break;
      case 'ArrowLeft':
        col -= 1;
        break;
      case 'ArrowRight':
        col += 1;
        break;
      default:
        break;
    }

    usePreviewTableStore.action.onCellPreview(col, row);
  } catch (error) {
    console.error('change preview error', error);
  }
};
