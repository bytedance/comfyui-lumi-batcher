// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Space } from '@arco-design/web-react';

import './index.scss';
import Flex from '@common/components/Flex';
import { I18n } from '@common/i18n';
import { LanguageChoose } from '../language-choose';
import ButtonClose from '../button-close';

export default function ModalHeader() {
  return (
    <Flex
      className="batch-tools-modal-header"
      justify="space-between"
      align="center"
    >
      <Space size={4}>
        <div className="batch-tools-modal-header-title">
          {I18n.t(
            '{placeholder1}_batch_generation',
            { placeholder1: 'ComfyUI-Lumi-Batcher' },
            '{placeholder1} 批量生成',
          )}
        </div>
        <div className="batch-tools-modal-header-subtitle">
          {I18n.t(
            'meet_various_debugging_scenarios__debugging_parameters_can_be_freely_combined__a',
            {},
            '满足各种调试场景，调试参数可自由组合，生成结果支持批量对比预览',
          )}
        </div>
      </Space>

      <Space size={24}>
        <LanguageChoose />
        <ButtonClose />
      </Space>
    </Flex>
  );
}
