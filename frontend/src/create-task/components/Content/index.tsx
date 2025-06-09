// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, Space } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import { openParamsConfigModal } from '../../../params-config';
import { useCreatorStore } from '../../store';
import { ParamsList } from '../ParamsList';

import './index.scss';
import { languageUtils, TranslateKeys } from '@common/language';
import { I18n } from '@common/i18n';

export const CreatorContent = () => {
  const [addParamsConfig] = useCreatorStore(
    useShallow((s) => [s.addParamsConfig]),
  );
  const addParams = () => {
    addParamsConfig();
    openParamsConfigModal();
  };

  return (
    <div className="sdk-creator-content">
      <section className="sdk-creator-content-title">
        <p className="sdk-creator-content-title-text">
          {languageUtils.getText(TranslateKeys.PARAM_LIST)}
        </p>
        <Space>
          <Button
            type="primary"
            status="default"
            onClick={addParams}
            size="small"
          >
            {I18n.t('custom_parameters', {}, '自定义参数')}
          </Button>
        </Space>
      </section>
      <ParamsList />
    </div>
  );
};
