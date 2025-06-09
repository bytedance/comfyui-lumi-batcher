// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Message } from '@arco-design/web-react';

import { PackageStatusEnum, TaskStatusEnum } from './constants';
import { languageUtils, TranslateKeys } from '@common/language';
import { updateTaskName } from '@api/batch-task';
import { I18n } from '@common/i18n';

/** 批量任务状态展示配置map */
export const TaskStatusDisplay = {
  [TaskStatusEnum.Waiting]: {
    name: languageUtils.getText(TranslateKeys.STATUS_WAITING),
    color: 'var(--text-color-text-1, rgba(255, 255, 255, 0.85))',
    background: 'var(--fills-color-fill-2, rgba(255, 255, 255, 0.08))',
  },
  [TaskStatusEnum.Running]: {
    name: languageUtils.getText(TranslateKeys.STATUS_RUNNING),
    color: 'var(--text-color-text-1, rgba(255, 255, 255, 0.85))',
    background: 'var(--fills-color-fill-2, rgba(255, 255, 255, 0.08))',
  },
  [TaskStatusEnum.Completed]: {
    name: languageUtils.getText(TranslateKeys.STATUS_COMPLETED),
    color: 'var(--tag-tagtext-green-success, #32D74B)',
    background: 'var(--tag-tagbg-green, rgba(50, 215, 75, 0.15))',
  },
  [TaskStatusEnum.Failed]: {
    name: languageUtils.getText(TranslateKeys.STATUS_FAILED),
    color: 'var(--tag-tagtext-pink-danger, #FF375F)',
    background: 'var(--tag-tagbg-pink, rgba(255, 55, 95, 0.15))',
  },
  [TaskStatusEnum.PartiallySucceeded]: {
    name: languageUtils.getText(TranslateKeys.STATUS_PARTIAL_SUCCEED),
    color: 'var(--tag-tagtext-orange-warning, #FF9F0A)',
    background: 'var(--tag-tagbg-orange, rgba(255, 159, 10, 0.15))',
  },
  [TaskStatusEnum.Succeed]: {
    name: languageUtils.getText(TranslateKeys.STATUS_SUCCEED),
    color: 'var(--tag-tagtext-green-success, #32D74B)',
    background: 'var(--tag-tagbg-green, rgba(50, 215, 75, 0.15))',
  },
  [TaskStatusEnum.Canceled]: {
    name: languageUtils.getText(TranslateKeys.STATUS_CANCELLED),
    color: 'var(--text-color-text-1, rgba(255, 255, 255, 0.85))',
    background: 'var(--fills-color-fill-2, rgba(255, 255, 255, 0.08))',
  },
  [TaskStatusEnum.Dirty]: {
    name: languageUtils.getText(TranslateKeys.STATUS_DIRTY),
    color: 'var(--text-color-text-1, rgba(255, 255, 255, 0.85))',
    background: 'var(--fills-color-fill-2, rgba(255, 255, 255, 0.08))',
  },
};

/** 批量任务打包状态展示配置map */
export const PackageStatusDisplay = {
  [PackageStatusEnum.Waiting]: {
    name: languageUtils.getText(TranslateKeys.STATUS_WAITING),
    color: 'var(---color-text-1, rgba(255, 255, 255, 0.90))',
  },
  [PackageStatusEnum.Packing]: {
    name: languageUtils.getText(TranslateKeys.STATUS_RUNNING),
    color: 'var(---color-text-1, rgba(255, 255, 255, 0.90))',
  },
  [PackageStatusEnum.Failed]: {
    name: languageUtils.getText(TranslateKeys.STATUS_FAILED),
    color: 'var(---magenta-6, #F756A9)',
  },
  [PackageStatusEnum.Succeed]: {
    name: languageUtils.getText(TranslateKeys.STATUS_SUCCEED),
    color: 'var(---primary-5, #50E5D7)',
  },
};

export const execUpdateTaskName = async (
  taskId: string,
  taskName: string,
  cb?: Function,
) => {
  try {
    await updateTaskName(taskId, taskName);
    cb && (await cb());
    Message.success(
      I18n.t('update_task_name_successful', {}, '更新任务名称成功'),
    );
  } catch (error) {
    cb && (await cb());
    Message.error(I18n.t('failed_to_update_task_name', {}, '更新任务名称失败'));
  }
};
