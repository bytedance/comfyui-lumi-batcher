// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type ReactNode, useMemo } from 'react';

import { Button, Tag, Tooltip } from '@arco-design/web-react';
import {
  IconCheckCircleFill,
  IconClockCircle,
  IconCloseCircleFill,
  IconExclamationCircleFill,
  IconInfoCircleFill,
  IconLoading,
} from '@arco-design/web-react/icon';

import { TaskStatusEnum } from '../../constants';
import { TaskStatusDisplay } from '../../shared';
import styles from './index.module.scss';
import { TaskInfo } from '@api/batch-task';
import { I18n } from '@common/i18n';

export default function TaskStatusTag(
  info: Pick<TaskInfo, 'queue_count' | 'status_counts' | 'messages' | 'status'>,
) {
  const { status } = info;

  const Content = useMemo(() => {
    // TODO: 后续需要集成打包状态的展示
    const { name, color, background } = TaskStatusDisplay[status];

    let tooltipContent: ReactNode | null, icon: ReactNode | null;
    const {
      success = 0,
      failed = 0,
      uploading_failed = 0,
      create_failed = 0,
    } = info.status_counts || {};

    const messages = info.messages?.filter(
      (m) => m !== I18n.t('success', {}, '成功'),
    );

    switch (status) {
      case TaskStatusEnum.PartiallySucceeded:
        tooltipContent = `${I18n.t(
          'successful_{success};_failed__{placeholder3}',
          { success, placeholder3: failed + uploading_failed + create_failed },
          '已成功：{success}；已失败：{placeholder3}',
        )}`;
        icon = <IconExclamationCircleFill />;
        break;
      case TaskStatusEnum.Failed:
        tooltipContent = (
          <>
            {I18n.t('reason_for_failure_', {}, '失败原因：')}
            {
              <>
                <span style={{ color }}>100002</span>
                {I18n.t(
                  'the_specific_reasons_are__{placeholder1}',
                  { placeholder1: messages?.join(', ') },
                  '。具体原因有：\n                {placeholder1}',
                )}
              </>
            }
          </>
        );
        icon = <IconCloseCircleFill />;
        break;
      case TaskStatusEnum.Succeed:
        tooltipContent = null;
        icon = <IconCheckCircleFill />;
        break;
      case TaskStatusEnum.Canceled:
        tooltipContent = null;
        icon = <IconInfoCircleFill />;
        break;
      case TaskStatusEnum.Running:
        tooltipContent = null;
        icon = <IconLoading />;
        break;
      case TaskStatusEnum.Waiting:
        tooltipContent = null;
        icon = <IconClockCircle />;
        break;
      default:
        tooltipContent = null;
        icon = null;
    }

    const doneSubTaskCount = failed + success + uploading_failed;

    const suffix =
      status === TaskStatusEnum.Running
        ? `-${
            doneSubTaskCount > 0
              ? Math.max(
                  Math.floor((doneSubTaskCount / info.queue_count) * 100),
                  1,
                )
              : 0
          }%`
        : null;

    return {
      name,
      color,
      background,
      tooltipContent,
      icon,
      suffix,
    };
  }, [info, status]);

  const { name, color, tooltipContent, icon, suffix, background } =
    Content || {};

  return (
    <Tooltip disabled={!tooltipContent} content={tooltipContent}>
      <Tag style={{ color, background }} className={styles.container}>
        <span style={{ fontSize: 12 }}>{icon}&nbsp;</span>
        {name}
        {suffix}
      </Tag>
    </Tooltip>
  );
}
