/* eslint-disable react/jsx-key */
// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, Space, Typography } from '@arco-design/web-react';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';

import { ReactComponent as ParamsCardDefaultBkg } from '@static/icons/params-card-default-bkg.svg';
import { ReactComponent as ParamsCardSelectBkg } from '@static/icons/params-card-select-bkg.svg';

import { useCreatorStore } from '../../store';

import './index.scss';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { languageUtils, TranslateKeys } from '@common/language';

export const ParamsCards = () => {
  const [paramsConfig, updateParamsConfig, deleteParamsConfig] =
    useCreatorStore(
      useShallow((s) => [
        s.paramsConfig,
        s.updateParamsConfig,
        s.deleteParamsConfig,
      ]),
    );

  const ParamsLabelContent = (props: { info: ParamsConfigTypeItem }) => {
    const { info } = props;
    const { nodeId, internal_name } = info;
    return (
      <span className="params-card-value">{`#${nodeId}/${internal_name}`}</span>
    );
  };

  // const handleDelete = (index: number) => {
  //   paramsConfig.splice(index, 1);
  //   useCreatorStore.setState({
  //     paramsConfig: [...paramsConfig],
  //   });
  // };

  return (
    <div className="params-cards-container">
      {paramsConfig.map((config, index) => (
        <>
          <div key={config.config_id} className="params-card">
            <span className="params-card-num">
              {config.type === 'group'
                ? config.values[0]?.values?.length
                : config.values.length}
            </span>
            <div className="params-card-content">
              <ParamsCardDefaultBkg className="params-card-bkg" />
              <ParamsCardSelectBkg className="params-card-bkg-select" />
              <section className="params-card-text-container">
                <Typography.Paragraph
                  className="params-card-title"
                  ellipsis={{
                    rows: 1,
                    showTooltip: true,
                    wrapper: 'div',
                  }}
                >
                  {config.name}
                </Typography.Paragraph>
                <span className="params-card-label">
                  {languageUtils.getText(TranslateKeys.CONTAIN_PARAMS)}：
                </span>
                <Space size="large" direction="vertical">
                  {config.type === 'group' ? (
                    config.values.map((item) => (
                      <ParamsLabelContent info={item} />
                    ))
                  ) : (
                    <ParamsLabelContent info={config} />
                  )}
                </Space>
              </section>
              <section className="params-card-footer">
                <Button
                  type="text"
                  icon={<IconDelete />}
                  style={{ color: 'rgba(255, 255, 255, 0.90)' }}
                  onClick={() => deleteParamsConfig(index)}
                >
                  {languageUtils.getText(TranslateKeys.DELETE)}
                </Button>
                <Button
                  type="text"
                  icon={<IconEdit />}
                  onClick={() => updateParamsConfig(config, index)}
                  style={{ color: 'rgba(255, 255, 255, 0.90)' }}
                >
                  {languageUtils.getText(TranslateKeys.EDIT)}
                </Button>
              </section>
            </div>
          </div>
          {index !== paramsConfig.length - 1 && (
            <div className="params-card-x">x</div>
          )}
        </>
      ))}
    </div>
  );
};
