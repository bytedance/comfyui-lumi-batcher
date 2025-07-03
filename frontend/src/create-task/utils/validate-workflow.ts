// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Message } from '@arco-design/web-react';
import { isUndefined } from 'lodash';

import { createTaskCheck } from './create-task-check';
import { ParamsConfigType } from '@common/type/batch-task';
import { Comfy } from '@typings/comfy';
import { I18n } from '@common/i18n';

function validateParamsConfigItem(
  workflowParamsConfig: Comfy.WorkflowOutput,
  taskParamsConfigItem: ParamsConfigType[number],
) {
  const { nodeId, internal_name } = taskParamsConfigItem;

  if (!nodeId || !internal_name) {
    return false;
  }

  if (isUndefined(workflowParamsConfig?.[nodeId]?.inputs?.[internal_name])) {
    return false;
  }

  return true;
}

export async function validateWorkflowParamsConfig(
  taskParamsConfig: ParamsConfigType,
) {
  // 输出节点和工作流联通性检测
  const flag = await createTaskCheck();
  if (!flag) {
    return false;
  }
  let workflowParamsConfig: Comfy.WorkflowOutput;
  if (window.app?.ue_modified_prompt) {
    const res = await window.app.ue_modified_prompt();
    workflowParamsConfig = res.output;
  } else {
    const res = await window.app.graphToPrompt();
    workflowParamsConfig = res.output;
  }

  for (const item of taskParamsConfig) {
    const { type, internal_name } = item;

    if (type === 'group') {
      if (
        !item.values.every((child) =>
          validateParamsConfigItem(workflowParamsConfig, child),
        )
      ) {
        validateFailedMessage();
        return false;
      }
    } else {
      if (internal_name === 'filename_prefix') {
        continue;
      }

      if (!validateParamsConfigItem(workflowParamsConfig, item)) {
        validateFailedMessage();
        return false;
      }
    }
  }

  return true;
}

const validateFailedMessage = () => {
  Message.error({
    content: I18n.t(
      'this_task_is_not_compatible_with_the_current_workflow_and_cannot_perform_a_copy_',
      {},
      '此任务与当前工作流不兼容，无法执行复制操作',
    ),
    duration: 3000,
  });
};
