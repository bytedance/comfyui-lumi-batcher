// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { Popconfirm } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import { ReactComponent as IconCancel } from '@static/icons/backward.svg';
import { ReactComponent as IconCopy } from '@static/icons/copy.svg';
import { ReactComponent as IconLayout } from '@static/icons/layout-alt.svg';
import { ReactComponent as IconDelete } from '@static/icons/task-list/delete-icon.svg';

import { TaskStatusEnum } from '../../constants';
import useHandler from './use-handler';
import { useBatchToolsStore } from '@src/batch-tools/state';
import { TaskInfo } from '@api/batch-task';
import { BatchTaskSceneEnum } from '@common/constant/batch';
import { I18n } from '@common/i18n';
import IconButtonTooltip from '@common/components/IconButtonTooltip';
import Flex from '@common/components/Flex';
import { languageUtils, TranslateKeys } from '@common/language';
import ResultDownload from '@src/result-download';

export default function TableOperator({
  task,
  refresh,
}: {
  task: TaskInfo;
  refresh: Function;
}) {
  const [uiConfig] = useBatchToolsStore(useShallow((s) => [s.uiConfig]));
  const statusType = task.status;
  const handler = useHandler(task);

  let [showCancelBtn, showResultDiffBtn, showCopyBtn] = [] as (
    | boolean
    | undefined
  )[];

  showCopyBtn = true;

  switch (statusType) {
    case TaskStatusEnum.Waiting:
    case TaskStatusEnum.Running:
      showCancelBtn = true;
      showResultDiffBtn = true;
      break;
    case TaskStatusEnum.Canceled:
    case TaskStatusEnum.Succeed:
    case TaskStatusEnum.PartiallySucceeded:
      showResultDiffBtn = true;
      break;
    case TaskStatusEnum.Dirty:
      showResultDiffBtn = true;
      break;
    default:
      break;
  }

  const showCancelOperation = useMemo(
    () => uiConfig.showCancel && showCancelBtn,
    [showCancelBtn, uiConfig.showCancel],
  );

  const showCopyOperation = useMemo(
    () =>
      uiConfig.showCopy &&
      showCopyBtn &&
      task.scene !== BatchTaskSceneEnum.LocalTask,
    [showCopyBtn, task.scene, uiConfig.showCopy],
  );

  return (
    <Flex align="center" gap={8}>
      {showCancelOperation ? (
        <Popconfirm
          title={I18n.t('confirm_to_cancel_the_task?', {}, '确认取消任务吗？')}
          onOk={async () => {
            await handler.cancel();
            refresh();
          }}
        >
          <IconButtonTooltip
            loading={handler.cancelLoading}
            icon={<IconCancel />}
            tooltip={languageUtils.getText(TranslateKeys.CANCEL_TASK)}
          />
        </Popconfirm>
      ) : null}
      <ResultDownload
        taskId={task.id}
        statusInfo={{
          status: task.status,
          packageStatus: task.package_info.status,
        }}
      />
      {showResultDiffBtn ? (
        <IconButtonTooltip
          icon={<IconLayout />}
          tooltip={languageUtils.getText(TranslateKeys.RESULT_DIFF_CHECK)}
          onClick={handler.diffResult}
        />
      ) : null}
      {showCopyOperation ? (
        <IconButtonTooltip
          icon={<IconCopy />}
          tooltip={languageUtils.getText(TranslateKeys.COPY_PARAMS)}
          onClick={handler.copy}
        />
      ) : null}
      <Popconfirm
        title={I18n.t('confirm_to_delete_the_task', {}, '确认删除任务吗？')}
        onOk={async () => {
          await handler.delete();
          refresh();
        }}
      >
        <IconButtonTooltip
          icon={<IconDelete />}
          loading={handler.deleteLoading}
          tooltip={I18n.t('delete_task', {}, '删除任务')}
        />
      </Popconfirm>
    </Flex>
  );
}
