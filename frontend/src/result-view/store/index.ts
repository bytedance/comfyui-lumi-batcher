// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { GetRoomResultsResponse } from '@api/result';
import { AdvancedFilterItem } from '@common/components/PreviewTable/components/AdvancedFilter/type';
import { ConfigOption } from '@common/type/result';
import { parseJsonStr } from '@common/utils/json';
import { isNumber } from 'lodash';
import { create } from 'zustand';

interface ResultViewStateType {
  visible: boolean;
  taskId: string;
  name: string;
  /** 以xx聚合的可选项 */
  tableConfigOptions: ConfigOption[];
  /** 以xx聚合的已选中项下标，已排除 tableConfigOptions 中的忽略项 */
  selectedConfigOptionIndex?: number;
  /** Slider 滑块改变预览图大小 */
  previewPercent: number;
  loading: boolean;
  /** 任务详情信息 */
  detail?: GetRoomResultsResponse;
  customColumns: Array<AdvancedFilterItem>;
  customRows: Array<AdvancedFilterItem>;
  originColumns: Array<AdvancedFilterItem>;
  originRows: Array<AdvancedFilterItem>;
  customColumnsChanged: boolean;
  customRowsChanged: boolean;

  /**
   * @param id 任务 id
   * @param name 任务名或分享名
   * @param tableConfigOptions 任务参数配置
   */
  setTask: (
    taskId: string,
    name: string,
    tableConfigOptions: string,
    selectedConfigOptionIndex?: number,
  ) => void;
  reset: () => void;
  openDrawer: () => Promise<void>;
}

const defaultStore: Omit<
  ResultViewStateType,
  'setTask' | 'reset' | 'openDrawer'
> = {
  visible: false,
  taskId: '',
  name: '',
  tableConfigOptions: [],
  previewPercent: 100,
  loading: true,
  customColumns: [],
  customRows: [],
  originColumns: [],
  originRows: [],
  customColumnsChanged: false,
  customRowsChanged: false,
};

export const useResultViewStore = create<ResultViewStateType>((set) => ({
  ...defaultStore,
  reset() {
    set(defaultStore);
  },
  setTask(
    taskId: string,
    name: string,
    tableConfigOptions: string,
    selectedConfigOptionIndex?: number,
  ) {
    set({
      ...defaultStore,
      taskId,
      name,
      tableConfigOptions: parseJsonStr<ConfigOption[]>(
        tableConfigOptions,
        [],
      ).filter((i) => i.category !== 'system'),
      selectedConfigOptionIndex:
        isNumber(selectedConfigOptionIndex) &&
        selectedConfigOptionIndex >= 0 &&
        selectedConfigOptionIndex < tableConfigOptions.length
          ? selectedConfigOptionIndex
          : undefined,
    });
  },
  async openDrawer() {
    set({
      visible: true,
    });
  },
}));

export const openResultViewDrawer = useResultViewStore.getState().openDrawer;
