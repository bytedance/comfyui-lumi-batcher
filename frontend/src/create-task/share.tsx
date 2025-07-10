// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Message } from '@arco-design/web-react';

import { useCreatorStore } from './store';
import { createBatchTask } from '@api/batch-task';
import { languageUtils, TranslateKeys } from '@common/language';
import { ParamsConfigType } from '@common/type/batch-task';
import { uuid } from '@common/utils/uuid';
import { I18n } from '@common/i18n';
import { getCurrentApiKey, getCurrentToken } from '@common/utils/auth';

export const createBatchTaskFunc = async () => {
  try {
    const { paramsConfig, taskName } = useCreatorStore.getState();
    let output: any, workflow: any;
    if (window.app?.ue_modified_prompt) {
      const res = await window.app.ue_modified_prompt();
      output = res.output;
      workflow = res.workflow;
    } else {
      output = await window.app.graphToPrompt();
      workflow = output.workflow;
      output = output.output;
    }
    await createBatchTask({
      client_id: sessionStorage.getItem('clientId') ?? '',
      prompt: output,
      workflow,
      auth_token_comfy_org: getCurrentToken(),
      api_key_comfy_org: getCurrentApiKey(),
      extra_data: {
        extra_pnginfo: { workflow },
      },
      task_name: taskName,
      params_config: paramsConfig,
      // number: 1,
    });
    console.log('创建批量任务成功');
    Message.success(
      I18n.t('create_batch_task_successfully', {}, '创建批量任务成功'),
    );
  } catch (error) {
    console.log('创建批量任务失败', error);
    Message.error(
      I18n.t('failed_to_create_batch_task', {}, '创建批量任务失败'),
    );
  }
};

export const NumberDom = (number: number, suffix = '') => (
  <div key={uuid()} className="batch-tools-count-label">
    <span key={uuid()} className="batch-tools-count-number">
      {number}
    </span>
    {suffix ? <span key={uuid()}>{suffix}</span> : null}
  </div>
);

export const paramsConfigAnalysis = (
  paramsConfig: ParamsConfigType,
): {
  domList: any[];
  count: number;
} => {
  let count = 1;
  const domList: any[] = [];
  paramsConfig.forEach((item, index) => {
    let currentCount = 0;

    if (item.type === 'group') {
      currentCount = item.values?.[0]?.values?.length;
    } else {
      currentCount = item.values?.length;
    }

    const finaleName =
      item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name;

    domList.push(
      NumberDom(
        currentCount,
        index !== paramsConfig.length - 1
          ? `${languageUtils.getText(
              TranslateKeys.PARAM_VALUES_COUNT_UNIT,
            )}(${finaleName}) x `
          : `${languageUtils.getText(
              TranslateKeys.PARAM_VALUES_COUNT_UNIT,
            )}(${finaleName})`,
      ),
    );

    count *= currentCount;
  });

  return {
    domList,
    count: paramsConfig.length ? count : 0,
  };
};

export const getParamsConfigNodeInfoString = (
  paramsConfig: ParamsConfigType,
): string => {
  let res = '';
  const getNodeTitle = (nodeId: number) =>
    window.app.graph.getNodeById(nodeId)?.title ?? '';
  paramsConfig.forEach((item, index) => {
    if (item.type === 'group') {
      item.values.forEach((value, ind) => {
        res += `${getNodeTitle(value.nodeId as number)}`;

        if (ind < item.values.length - 1) {
          res += ' + ';
        }
      });
    } else {
      res += `${getNodeTitle(item.nodeId as number)}`;
    }

    if (index < paramsConfig.length - 1) {
      res += ', ';
    }
  });

  return res;
};

/** 获取批量任务预期出图数量 */
export const getQueueCount = (paramsConfig: ParamsConfigType): number => {
  let count = 1;
  paramsConfig.forEach((item) => {
    let currentCount = 0;

    if (item.type === 'group') {
      currentCount = item.values?.[0]?.values?.length;
    } else {
      currentCount = item.values?.length;
    }

    count *= currentCount;
  });

  return paramsConfig.length ? count : 0;
};
