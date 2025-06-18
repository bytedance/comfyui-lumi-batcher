// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useCallback, useEffect, useMemo } from 'react';

import { Popconfirm, Space } from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';

import { CreatorContent } from './components/Content';
import { RightPanel } from './components/right-panel';
import { useCreatorStore } from './store';
import { analysisAllNodes } from './utils/analysis-all-nodes';
import { createTaskCheck } from './utils/create-task-check';

import './index.scss';
import { useContainerStore } from '@common/state/container';
import { ContainerTypeEnum } from '@common/constant/container';
import { useBatchToolsStore } from '@src/batch-tools/state';
import { languageUtils, TranslateKeys } from '@common/language';
import LayoutV2 from '@common/components/LayoutV2';
import { I18n } from '@common/i18n';
import { sendBatchToolsCreateTask } from '../../data/points';
import { newGuideHelpLink } from '@common/constant/creator';

export const goToCreateTask = () => {
  sendBatchToolsCreateTask();
  useCreatorStore.setState({
    checkWorkflowLoading: true,
  });
  createTaskCheck().then((flag) => {
    useCreatorStore.setState({
      checkWorkflowLoading: false,
    });
    if (flag) {
      useContainerStore.getState().changeType(ContainerTypeEnum.Creator);
    }
  });
};

export const CreateTask = () => {
  const [paramsConfig, reset] = useCreatorStore(
    useShallow((s) => [s.paramsConfig, s.reset]),
  );
  const [task] = useBatchToolsStore(useShallow((s) => [s.task]));
  const [changeType] = useContainerStore(useShallow((s) => [s.changeType]));
  useEffect(() => {
    analysisAllNodes();
  }, []);

  const Content = useMemo(
    () => (
      <div className="batch-tools-creator-content">
        <CreatorContent />
        <RightPanel />
      </div>
    ),
    [],
  );

  const handleBack = useCallback(() => {
    changeType(ContainerTypeEnum.List);
    reset();
  }, [changeType, reset]);

  const BackContent = useMemo(
    () => (
      <Space className="batch-tools-creator-back-content">
        <Popconfirm
          focusLock
          title={I18n.t(
            'exit_operation_means_that_your_batch_tasks_and_parameters_will_not_be_preserved_',
            {},
            '退出操作意味着你所进行的批量任务和参数将不会被保留。你确定要退出吗',
          )}
          onOk={handleBack}
          cancelText={I18n.t('give_up', {}, '放弃')}
          okText={I18n.t('ok_to_quit', {}, '确定退出')}
          disabled={paramsConfig.length === 0}
        >
          <div
            className="batch-tools-creator-back-button"
            onClick={() => {
              if (paramsConfig.length === 0) {
                handleBack();
              }
            }}
          >
            <IconLeft style={{ fontSize: 16 }} />
            {languageUtils.getText(TranslateKeys.EXIT)}
          </div>
        </Popconfirm>
      </Space>
    ),
    [handleBack, paramsConfig],
  );

  return (
    <LayoutV2
      guideLink={task.newGuideHelpLink || newGuideHelpLink}
      title={I18n.t('new_batch_task', {}, '新建批量任务')}
      content={Content}
      backContent={BackContent}
      style={{
        height: '100%',
      }}
    />
  );
};

export default CreateTask;
