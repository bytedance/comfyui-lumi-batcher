// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { type TaskStatusEnum } from './constants';
import { useTaskListStore } from './store';
import { uuid } from '@common/utils/uuid';
import pollingManager from '@common/utils/polling-manager';
import { getTaskList } from '@api/batch-task';

export function useTaskList() {
  const [
    taskName,
    filtedStatus,
    currentPage,
    pageSize,
    stopPollingList,
    taskStatusFilter,
  ] = useTaskListStore(
    useShallow((s) => [
      s.taskName,
      s.filted.status,
      s.currentPage,
      s.pageSize,
      s.stopPollingList,
      s.taskStatusFilter,
    ]),
  );
  const { setState } = useTaskListStore;
  /** 当前正在执行get_task_list请求，用于管理如果当前有正在请求，则不触发新的轮询请求 */
  const isGettingTaskList = useRef(false);
  /** 当前正在执行Simple请求 */
  const isSimpleGetTaskList = useRef(false);
  /** 守卫：标识最新的接口请求，并将其触发数据更新 */
  const currentReqKey = useRef(uuid());

  const taskStatusList = useMemo(() => {
    const res: TaskStatusEnum[] = [];
    taskStatusFilter.forEach((v) => res.push(...v));
    return res;
  }, [taskStatusFilter]);

  const simpleGetTaskList = async () => {
    const reqKey = uuid();
    currentReqKey.current = reqKey;

    isSimpleGetTaskList.current = true;

    setState({
      loading: true,
    });

    const { taskName, pageSize, currentPage } = useTaskListStore.getState();

    const tsl: TaskStatusEnum[] = [];
    useTaskListStore.getState().taskStatusFilter.forEach((v) => tsl.push(...v));

    try {
      const res = await getTaskList(taskName, pageSize, currentPage, tsl);

      if (reqKey === currentReqKey.current) {
        // 判断是否非首页，且查询数据为空
        if (currentPage > 1 && res.data.data.length === 0) {
          useTaskListStore.setState({
            currentPage: currentPage - 1,
          });
          await simpleGetTaskList();
          return;
        }
        setState({
          taskList: res.data.data,
          total: res.data.total,
        });
      }
    } catch (error) {
      console.error('获取任务列表失败');
    } finally {
      setState({
        loading: false,
      });
      isSimpleGetTaskList.current = false;
    }
  };

  /** 轮询方法请求 */
  const getList = useCallback(
    /** @param [isSilent=false] 定时刷新 */
    async (isSilent = false) => {
      // simple getTaskList 优先级最高
      if (isSimpleGetTaskList.current || stopPollingList) {
        return;
      }
      const reqKey = uuid();
      currentReqKey.current = reqKey;

      isGettingTaskList.current = true;

      setState({
        loading: !isSilent,
      });
      try {
        const res = await getTaskList(
          taskName,
          pageSize,
          currentPage,
          taskStatusList,
        );

        if (
          stopPollingList ||
          isSimpleGetTaskList.current ||
          reqKey !== currentReqKey.current
        ) {
          return;
        }
        const taskList = res.data.data;

        setState({
          isError: false,
          taskList,
          total: res.data.total,
          loading: false,
        });

        isGettingTaskList.current = false;
      } catch (error) {
        console.error('获取任务列表失败');
        setState({
          isError: true,
          loading: false,
        });
        isGettingTaskList.current = false;
      }
    },
    [
      taskName,
      filtedStatus,
      pageSize,
      currentPage,
      stopPollingList,
      taskStatusList,
    ],
  );

  /** 获取最新的get_list并在符合条件下启动轮询 */
  useEffect(() => {
    const getTaskListIntervalKey = 'getTaskListIntervalKey';
    pollingManager.startPolling(
      () => {
        if (
          isGettingTaskList.current ||
          isSimpleGetTaskList.current ||
          stopPollingList
        ) {
          return;
        }
        getList(true);
      },
      2 * 1000,
      getTaskListIntervalKey,
    );
    return () => {
      pollingManager.clearPolling(getTaskListIntervalKey);
    };
  }, [getList, stopPollingList]);

  /** 监控过滤条件变化并触发接口重新查询 */
  useEffect(() => {
    simpleGetTaskList();
  }, [taskName, filtedStatus, pageSize, currentPage, taskStatusList]);

  return {
    run: getList,
    runSimple: simpleGetTaskList,
  };
}
