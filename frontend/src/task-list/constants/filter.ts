// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { TaskStatusEnum } from '.';
import { I18n } from '@common/i18n';

export const TaskStatusFilterList = [
  {
    label: I18n.t('generating', {}, '生成中'),
    value: [TaskStatusEnum.Running, TaskStatusEnum.Completed],
  },
  {
    label: I18n.t('in_line', {}, '排队中'),
    value: [TaskStatusEnum.Waiting],
  },
  {
    label: I18n.t('success', {}, '成功'),
    value: [TaskStatusEnum.Succeed],
  },
  {
    label: I18n.t('fail', {}, '失败'),
    value: [TaskStatusEnum.Failed],
  },
  {
    label: I18n.t('partial_success', {}, '部分成功'),
    value: [TaskStatusEnum.PartiallySucceeded],
  },
  {
    label: I18n.t('cancelled', {}, '已取消'),
    value: [TaskStatusEnum.Canceled],
  },
  {
    label: I18n.t('expired', {}, '已失效'),
    value: [TaskStatusEnum.Dirty],
  },
];
