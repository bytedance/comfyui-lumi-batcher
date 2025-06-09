// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo, useState } from 'react';

import { Button, Input, Message } from '@arco-design/web-react';
import Content from '@arco-design/web-react/es/Layout/content';
import cn from 'classnames';
import { useShallow } from 'zustand/react/shallow';

import FinalCountImg from '@static/img/create-task/final_count.png';

import { createBatchTaskFunc, paramsConfigAnalysis } from '../../share';
import { useCreatorStore } from '../../store';
import styles from './index.module.scss';
import { useContainerStore } from '@common/state/container';
import { I18n } from '@common/i18n';
import { ContainerTypeEnum } from '@common/constant/container';
import { FormItemLayout } from '@common/components/FormItemLayout';
import { languageUtils, TranslateKeys } from '@common/language';
import { sendBatchToolsSubmitTask } from '../../../../data/points';

export const RightPanel = () => {
  const [taskName, paramsConfig, reset] = useCreatorStore(
    useShallow((s) => [s.taskName, s.paramsConfig, s.reset]),
  );
  const [changeType] = useContainerStore(useShallow((s) => [s.changeType]));
  const [loading, setLoading] = useState(false);

  const paramsConfigResult = useMemo(
    () => paramsConfigAnalysis(paramsConfig),
    [paramsConfig],
  );
  const TaskNameInput = useMemo(
    () => (
      <div className="input-wrapper">
        <Input
          style={{
            width: '100%',
          }}
          value={taskName}
          placeholder={I18n.t(
            'come_up_with_a_name_for_the_batch_task_',
            {},
            '为批量任务取个名字吧～',
          )}
          onChange={(v) => {
            useCreatorStore.setState({
              taskName: v,
            });
          }}
          maxLength={50}
        />
      </div>
    ),
    [taskName],
  );

  const handleOk = async () => {
    sendBatchToolsSubmitTask();
    setLoading(true);
    try {
      await new Promise((resolve) => {
        createBatchTaskFunc().then(() => {
          resolve('');
        });
      });
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

  return (
    <div className={styles.container}>
      <section className={cn(styles.section, styles.finalCount)}>
        <header className={styles.header}>
          <p className={styles.headerTitle}>
            {languageUtils.getText(TranslateKeys.FINAL_RESULT_COUNT)}
          </p>
          <p className={styles.headerCount}>
            {paramsConfigResult.count.toLocaleString()}
          </p>
        </header>

        {paramsConfig.length > 0 ? (
          <Content className={styles.content}>
            {paramsConfig.map((config) => {
              const { type, config_id } = config;
              const count =
                type === 'group'
                  ? config.values[0].values.length
                  : config.values.length;
              const text =
                type === 'group'
                  ? config.values.map((i) => i.internal_name).join('、')
                  : config.internal_name;
              return (
                <div className={styles.card} key={config_id}>
                  <p className={styles.cardCount}>
                    {(count || 0).toLocaleString()}
                  </p>
                  <p className={styles.cardText}>{text}</p>
                </div>
              );
            })}
          </Content>
        ) : (
          <div className={styles.finalCountDefault}>
            <img style={{ width: 120 }} src={FinalCountImg} alt="" />
            <span>
              {I18n.t('final_number_of_generate_count_', {}, '最终生成数=')}
              <br />
              {I18n.t(
                'parameter_1_x_parameter_2_x____parameter_n',
                {},
                '参数1 x 参数2 x... 参数N',
              )}
            </span>
          </div>
        )}
      </section>
      <section className={cn(styles.section, styles.titleName)}>
        <FormItemLayout
          label={I18n.t('task_name', {}, '任务名称')}
          content={TaskNameInput}
        />
        <Button
          type="primary"
          onClick={handleOk}
          disabled={paramsConfig.length === 0 || taskName.trim().length === 0}
          loading={loading}
          style={{
            width: '100%',
            height: 44,
            borderRadius: 100,
          }}
        >
          {loading
            ? languageUtils.getText(TranslateKeys.SPENT_LONG_TIME_TEXT)
            : languageUtils.getText(TranslateKeys.SUBMIT_CREATE_BATCH_TASK)}
        </Button>
      </section>
    </div>
  );
};
