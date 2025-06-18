// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useState } from 'react';

import { Button, Message, Popconfirm, Space } from '@arco-design/web-react';
import { IconArrowLeft } from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';

import { createBatchTaskFunc } from '../../share';
import { useCreatorStore } from '../../store';
import TitleEdit from '../TitleEdit';

import './index.scss';
import { useContainerStore } from '@common/state/container';
import { I18n } from '@common/i18n';
import { ContainerTypeEnum } from '@common/constant/container';
import { languageUtils, TranslateKeys } from '@common/language';

export const CreatorHeader = () => {
  const [taskName, paramsConfig, reset] = useCreatorStore(
    useShallow((s) => [s.taskName, s.paramsConfig, s.reset]),
  );
  const [loading, setLoading] = useState(false);
  const [changeType] = useContainerStore(useShallow((s) => [s.changeType]));

  const handleTitleChange = (v: string) => {
    if (!v) {
      Message.error(
        I18n.t('task_name_cannot_be_empty', {}, '任务名称不能为空'),
      );
      return;
    }
    useCreatorStore.setState({
      taskName: v,
    });
  };
  const handleOk = async () => {
    setLoading(true);
    try {
      await createBatchTaskFunc();
      changeType(ContainerTypeEnum.List);
      reset();
    } catch (err) {
      Message.error(
        I18n.t(
          'please_check_that_all_forms_are_completed',
          {},
          '请检查所有表单内容均填写完整',
        ),
      );
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    changeType(ContainerTypeEnum.List);
    reset();
  };
  return (
    <div className="creator-header">
      <section className="creator-header-left">
        <Space>
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
            <Button
              className="batch-tools-modal-button-close"
              type="default"
              size="small"
              onClick={() => {
                if (paramsConfig.length === 0) {
                  handleBack();
                }
              }}
            >
              <IconArrowLeft style={{ fontSize: 16, marginRight: 8 }} />
              {languageUtils.getText(TranslateKeys.EXIT)}
            </Button>
          </Popconfirm>
        </Space>
      </section>
      <section className="creator-header-center">
        <TitleEdit title={taskName} onChange={handleTitleChange} />
      </section>
      <section className="creator-header-right">
        <Button
          type="primary"
          onClick={handleOk}
          disabled={paramsConfig.length === 0}
          loading={loading}
        >
          {loading
            ? languageUtils.getText(TranslateKeys.SPENT_LONG_TIME_TEXT)
            : languageUtils.getText(TranslateKeys.SUBMIT_CREATE_BATCH_TASK)}
        </Button>
      </section>
    </div>
  );
};
