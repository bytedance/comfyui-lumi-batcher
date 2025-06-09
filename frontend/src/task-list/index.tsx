// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo } from 'react';

import { Table } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import { TaskResultDrawer } from '../result-view';
import { CreateTaskButton } from './components/create-task-button';
import TableHeader from './components/table-header';
import { useTaskListStore } from './store';
import { useColumns } from './use-columns';
import { useTaskList } from './use-task-list';

import './index.scss';
import { I18n } from '@common/i18n';
import Flex from '@common/components/Flex';
import useResize from '@common/hooks/use-resize';
import { EmptyList } from '@common/components/EmptyList';
import Result from '@common/components/Result';
import { useBatchToolsStore } from '@src/batch-tools/state';

export default function TaskList() {
  const [containerRect, listPaddingHorizontal] = useBatchToolsStore(
    useShallow((s) => [s.containerRect, s.uiConfig.listPaddingHorizontal]),
  );
  const innerCalcHeight = useResize(() => window.innerHeight - 270);
  const [taskName, isError, taskList, currentPage, pageSize, total, loading] =
    useTaskListStore(
      useShallow((s) => [
        s.taskName,
        s.isError,
        s.taskList,
        s.currentPage,
        s.pageSize,
        s.total,
        s.loading,
      ]),
    );
  const { changePagination } = useTaskListStore();
  const { runSimple: getTaskList } = useTaskList();
  const columns = useColumns(getTaskList);

  const tableHeight = useMemo(() => {
    const paginationHeight = total > 0 ? 60 : 0;
    return containerRect.clientHeight
      ? containerRect.clientHeight - 108 - paginationHeight
      : innerCalcHeight;
  }, [containerRect.clientHeight, innerCalcHeight, total]);

  useEffect(
    () => () => {
      useBatchToolsStore.getState().closeShareModal?.();
    },
    [],
  );

  const NoDataContent = useMemo(() => {
    if (taskName && !taskList.length) {
      return (
        <EmptyList
          style={{
            height: tableHeight - 60,
          }}
          text={I18n.t(
            'no_search_results_yet__try_searching_for_other_content',
            {},
            '暂无搜索结果，试试搜索其他内容',
          )}
        />
      );
    } else {
      return (
        <EmptyList
          style={{
            height: tableHeight - 60,
          }}
          text={I18n.t('task_list_is_empty', {}, '任务列表为空')}
          loading={loading}
          extra={
            loading ? null : (
              <CreateTaskButton
                style={{
                  marginTop: 8,
                }}
              />
            )
          }
        />
      );
    }
  }, [loading, tableHeight, taskList, taskName]);

  const DrawerContent = useMemo(() => <TaskResultDrawer />, []);

  return (
    <div className="task-list">
      <Flex
        className="task-list-table"
        style={{
          padding: `0 ${listPaddingHorizontal}px`,
        }}
        direction="column"
        gap={16}
      >
        <TableHeader />
        {isError ? (
          <Result
            className="task-list-table-result"
            status={Result.Status.NetworkError}
          />
        ) : (
          <>
            <Table
              rowKey="id"
              columns={columns}
              data={taskList}
              loading={taskName?.length ? loading : false}
              size="default"
              noDataElement={NoDataContent}
              onChange={changePagination}
              pagination={{
                pageSize,
                total,
                current: currentPage,
                sizeCanChange: true,
                showTotal: true,
                showJumper: true,
              }}
              scroll={{
                x: columns.reduce(
                  (width, curr) => width + Number(curr.width ?? 0),
                  0,
                ),
                y: tableHeight,
              }}
            />
          </>
        )}
      </Flex>
      {DrawerContent}
    </div>
  );
}
