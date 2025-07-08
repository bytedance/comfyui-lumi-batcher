// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { workflowValidate } from '@api/common';
import { Link, Message } from '@arco-design/web-react';
import { IconCloseCircleFill } from '@arco-design/web-react/icon';
import { I18n } from '@common/i18n';
import { useBatchToolsStore } from '@src/batch-tools/state';
import { Comfy } from '@typings/comfy';

const OutputNodesList = [
  'SaveImage',
  'Image Save',
  'VHS_VideoCombine',
  'VideoCombine_Adv',
  'ShowText|pysssss',
  'DisplayString',
  'SaveVideo',
];

// 检测输出节点是否在输出节点列表中
export const checkOutputNodes = (output: Comfy.WorkflowOutput) =>
  Object.values(output).some((node) =>
    OutputNodesList.includes(node.class_type),
  );

export const createTaskCheck = async (): Promise<boolean> => {
  try {
    let output: any;
    let workflow: any;
    if (window.app?.ue_modified_prompt) {
      const res = await window.app.ue_modified_prompt();
      output = res.output;
      workflow = res.workflow;
    } else {
      output = await window.app.graphToPrompt();
      workflow = output.workflow;
      output = output.output;
    }
    const link = useBatchToolsStore.getState().task.outputRuleLink;
    const hasOutputNode = checkOutputNodes(output);
    // save image节点验证
    if (!hasOutputNode) {
      Message.normal({
        id: 'workflow_check_error',
        content: (
          <div
            style={{
              display: 'flex',
              gap: 8,
            }}
          >
            <IconCloseCircleFill
              style={{ fontSize: 20, color: 'rgb(var(--danger-6))' }}
            />
            <div style={{ display: 'inline-block', textAlign: 'left' }}>
              {I18n.t(
                'it_is_detected_that_there_is_no_output_node_in_the_current_workflow__please_add_one',
                {},
                '检测到当前工作流没有输出节点，请添加相关节点后再进行批量验证!',
              )}
              <br />
              {I18n.t(
                'please_check_the_output_node_specification__',
                {},
                '输出节点规范请查看,',
              )}
              <Link href={link} target="_blank">
                {I18n.t('help_documentation', {}, '帮助文档')}
              </Link>
            </div>
          </div>
        ),
      });
      return false;
    }

    try {
      await workflowValidate(0, output, workflow);
    } catch (error) {
      Message.error(
        I18n.t(
          'current_workflow_cannot_be_executed',
          {},
          '检测到当前工作流无法跑通，请跑通工作流后再进行批量验证',
        ),
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to execute create-task check');
    return false;
  }
};
