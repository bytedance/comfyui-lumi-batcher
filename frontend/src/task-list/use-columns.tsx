// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import type { ColumnProps } from '@arco-design/web-react/es/Table';
import { useShallow } from 'zustand/react/shallow';

import { CustomFilters } from './components/custom-filters';
import TableOperator from './components/table-operator';
import TaskStatusTag from './components/task-status-tag';
import { type TaskStatusEnum } from './constants';
import { TaskStatusFilterList } from './constants/filter';
import { execUpdateTaskName } from './shared';
import { useTaskListStore } from './store';
import AutoResizeInput from '@common/components/AutoResizeInput';
import { I18n } from '@common/i18n';
import { TaskInfo } from '@api/batch-task';
import { formatSerialNumber } from '@common/utils/text';
import { formatDatetimeV2 } from '@common/utils/time';

export function useColumns(refresh: Function) {
  const [taskList, pageSize, currentPage, taskStatusFilter] = useTaskListStore(
    useShallow((s) => [
      s.taskList,
      s.pageSize,
      s.currentPage,
      s.taskStatusFilter,
    ]),
  );

  const columns: ColumnProps<TaskInfo>[] = useMemo(
    () => [
      {
        width: 100,
        title: I18n.t('serial_number', {}, '序号'),
        fixed: 'left',
        render: (col, item, index) => {
          const num = pageSize * (currentPage - 1) + index + 1;
          return formatSerialNumber(num);
        },
      },
      {
        width: 300,
        title: I18n.t('task_name', {}, '任务名称'),
        fixed: 'left',
        dataIndex: 'name',
        render: (col, item, index) => (
          <AutoResizeInput
            value={col}
            fontSize={14}
            maxWidth={240}
            maxLength={50}
            onChange={async (v) => {
              if (v?.trim()) {
                const finalValue = v.trim();
                if (finalValue === taskList[index].name) {
                  return;
                }
                taskList[index].name = finalValue;
                useTaskListStore.setState({
                  taskList: [...taskList],
                  stopPollingList: true,
                });
                await execUpdateTaskName(item.id, finalValue, refresh);
                useTaskListStore.setState({
                  taskList: [...taskList],
                  stopPollingList: false,
                });
              }
            }}
          />
        ),
      },
      {
        width: 200,
        title: I18n.t('creation_time', {}, '创建时间'),
        dataIndex: 'created_at',
        render: (col) => formatDatetimeV2(new Date(col).getTime()),
      },
      {
        width: 180,
        title: I18n.t('generation_quantity', {}, '生成数量'),
        dataIndex: 'queue_count',
      },
      {
        width: 180,
        title: I18n.t('state', {}, '状态'),
        fixed: 'right',
        dataIndex: 'status',
        filterDropdown: (props) => (
          <CustomFilters
            filterList={TaskStatusFilterList}
            value={taskStatusFilter}
            onOk={(v) => {
              useTaskListStore.setState({
                taskStatusFilter: v as TaskStatusEnum[][],
              });
              props.confirm?.(v);
            }}
            onReset={() => {
              useTaskListStore.setState({
                taskStatusFilter: [],
              });
              props.confirm?.([]);
            }}
          />
        ),
        render(col, item) {
          return <TaskStatusTag {...item} />;
        },
      },
      {
        width: 220,
        title: I18n.t('operation', {}, '操作'),
        dataIndex: '_',
        fixed: 'right',
        render(col, item) {
          return <TableOperator task={item} refresh={refresh} />;
        },
      },
    ],
    [currentPage, pageSize, refresh, taskList, taskStatusFilter],
  );

  return columns;
}
