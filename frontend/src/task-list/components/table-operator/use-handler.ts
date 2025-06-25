// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo, useState } from 'react';

import { Message } from '@arco-design/web-react';

import { I18n } from '@common/i18n';
import { ParamsConfigType } from '@common/type/batch-task';
import { cancelTask, deleteTask, TaskInfo } from '@api/batch-task';
import { useContainerStore } from '@common/state/container';
import { useResultViewStore } from '@src/result-view/store';
import { useCreatorStore } from '@src/create-task/store';
import { parseJsonStr } from '@common/utils/json';
import { validateWorkflowParamsConfig } from '@src/create-task/utils/validate-workflow';
import { ContainerTypeEnum } from '@common/constant/container';
import {
  sendBatchToolsCancelTask,
  sendBatchToolsCopyParams,
  sendBatchToolsPreviewResult,
} from '../../../../data/points';
import { TaskStatusEnum } from '@src/task-list/constants';

export default function useHandler(task: TaskInfo) {
  const { changeType } = useContainerStore();
  const { setTask, openDrawer } = useResultViewStore();
  const { copy: copyTask } = useCreatorStore();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  return useMemo(() => {
    const { id, name, status } = task;

    return {
      async cancel() {
        try {
          setCancelLoading(true);
          sendBatchToolsCancelTask();
          await cancelTask(id);
          Message.success(
            I18n.t('cancel_task_successfully', {}, '取消任务成功'),
          );
        } catch (error) {
          Message.error(I18n.t('cancel_task_failed', {}, '取消任务失败'));
        } finally {
          setCancelLoading(false);
        }
      },
      /**
       * @description 删除任务
       */
      async delete() {
        try {
          setDeleteLoading(true);
          // 先取消任务
          if (
            [TaskStatusEnum.Running, TaskStatusEnum.Waiting].includes(status)
          ) {
            await cancelTask(id);
          }
          // 是否补充埋点
          // 再执行删除
          await deleteTask(id);
          Message.success(
            I18n.t('delete_task_successfully', {}, '删除任务成功'),
          );
        } catch (error) {
          Message.error(I18n.t('delete_task_failed', {}, '删除任务失败'));
        } finally {
          setDeleteLoading(false);
        }
      },
      restart() {
        Message.error(I18n.t('pending', {}, '待处理'));
      },
      diffResult() {
        sendBatchToolsPreviewResult();
        setTask(id, name, task.params_config);
        openDrawer();
      },
      async copy() {
        sendBatchToolsCopyParams();
        const paramsConfig = parseJsonStr<ParamsConfigType>(
          task.params_config,
          [],
        );
        if (await validateWorkflowParamsConfig(paramsConfig)) {
          copyTask({
            taskName: task.name,
            paramsConfig,
          });
          changeType(ContainerTypeEnum.Creator);
          Message.success({
            content: I18n.t(
              'parameter_copied_successfully',
              {},
              '参数复制成功',
            ),
            duration: 2000,
          });
        }
      },
      remove() {
        Message.error(I18n.t('pending', {}, '待处理'));
      },
      deleteLoading,
      cancelLoading,
    };
  }, [task, deleteLoading, cancelLoading]);
}
