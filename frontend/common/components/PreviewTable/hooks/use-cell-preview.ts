// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ResultItem } from '@api/result';
import { useCallback, useState } from 'react';

/** 处理单元格点击 */
export function useValuePreview(): [
  ResultItem[] | undefined,
  {
    onCellPreview: (value: ResultItem[]) => void;
    onClear: () => void;
  },
] {
  const [preview, setPreview] = useState<ResultItem[]>();

  const onCellPreview = useCallback((v: ResultItem[]) => {
    setPreview(v);
  }, []);

  const onClear = useCallback(() => {
    setPreview(undefined);
  }, []);

  return [preview, { onCellPreview, onClear }];
}
