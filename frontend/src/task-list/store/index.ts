// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type PaginationProps } from '@arco-design/web-react';
import type { SorterInfo } from '@arco-design/web-react/es/Table/interface.d.ts';
import { create } from 'zustand';

import { TaskStatusEnum } from '../constants';
import { TaskInfo } from '@api/batch-task';

interface TaskListStateType {
  taskName?: string;
  filted: {
    status?: string[];
  };
  taskStatusFilter: TaskStatusEnum[][];
  isError: boolean;
  pageSize: number;
  currentPage: number;
  total: number;
  taskList: TaskInfo[];
  loading: boolean;
  changePagination: (
    pagination: PaginationProps,
    sorter: SorterInfo | SorterInfo[],
    filters: Partial<Record<keyof TaskInfo, string[]>>,
  ) => void;

  stopPollingList: boolean;
}

const defaultStore: Omit<TaskListStateType, 'reset' | 'changePagination'> = {
  isError: false,
  filted: {},
  currentPage: 1,
  pageSize: 10,
  total: 0,
  taskList: [],
  loading: true,
  stopPollingList: false,
  taskStatusFilter: [],
};

export const useTaskListStore = create<TaskListStateType>((set) => ({
  ...defaultStore,
  reset() {
    set(defaultStore);
  },
  changePagination(
    pagination: PaginationProps,
    sorter: SorterInfo | SorterInfo[],
    filters: Partial<Record<keyof TaskInfo, string[]>>,
  ) {
    const filtedStatus: string[] = [];
    const { status } = filters as unknown as {
      status?: TaskStatusEnum[];
    };
    status?.forEach((it) => {
      filtedStatus.push(
        ...{
          [TaskStatusEnum.Waiting]: ['waiting'],
          [TaskStatusEnum.Running]: ['running'],
          [TaskStatusEnum.PartiallySucceeded]: ['partial-success'],
          [TaskStatusEnum.Succeed]: ['success'],
          [TaskStatusEnum.Failed]: ['failed'],
          [TaskStatusEnum.Canceled]: ['canceled'],
          [TaskStatusEnum.Dirty]: ['dirty'],
          [TaskStatusEnum.Completed]: ['completed'],
        }[it],
      );
    });

    set({
      currentPage: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
      filted: {
        status: [...new Set(filtedStatus)],
      },
    });
  },
}));
