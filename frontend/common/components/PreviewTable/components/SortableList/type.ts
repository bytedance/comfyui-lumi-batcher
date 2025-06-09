// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type PreviewTableCellValueType } from '../../type/table';

export interface SortableItemProps {
  id: string;
  selected: boolean;
  value: PreviewTableCellValueType;
  onChange?: (isSelected: boolean) => void;
}

export interface SortableListProps {
  list: Array<SortableItemProps>;
  className?: string;
  style?: React.CSSProperties;
  onChange: (newArray: Array<SortableItemProps>) => void;
}

export interface SortableCompProps {
  list: Array<SortableItemProps>;
  className?: string;
  style?: React.CSSProperties;
  onChange: (newArray: Array<SortableItemProps>) => void;
}
