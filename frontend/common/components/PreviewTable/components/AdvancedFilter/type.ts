// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type SortableItemProps } from '../SortableList/type';

export interface AdvancedFilterItem {
  id: string;
  label: string;
  selected: boolean;
  expanded: boolean;
  options: SortableItemProps[];
}

export interface AdvancedFilterProps {
  label: string;
  list: Array<AdvancedFilterItem>;
  originList: Array<AdvancedFilterItem>;
  onFilter: (newArray: Array<AdvancedFilterItem>) => void;
}
