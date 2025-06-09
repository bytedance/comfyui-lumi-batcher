// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import { useBatchToolsStore } from '@src/batch-tools/state';
import { useCreatorStore } from '@src/create-task/store';
import { goToCreateTask } from '@src/create-task';
import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '@common/language';

export const CreateTaskButton = (props: { style?: React.CSSProperties }) => {
  const [uiConfig] = useBatchToolsStore(useShallow((s) => [s.uiConfig]));

  const [checkWorkflowLoading] = useCreatorStore(
    useShallow((s) => [s.checkWorkflowLoading]),
  );
  return (
    <>
      {uiConfig.showCreateTask ? (
        <Button
          type="primary"
          onClick={goToCreateTask}
          loading={checkWorkflowLoading}
          style={props.style ?? {}}
        >
          {checkWorkflowLoading
            ? I18n.t('checking_workflow', {}, '正在检测工作流')
            : languageUtils.getText(TranslateKeys.CREATE_BATCH_TASK)}
        </Button>
      ) : null}
    </>
  );
};
