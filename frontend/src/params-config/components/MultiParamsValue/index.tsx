// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Grid } from '@arco-design/web-react';
import GridItem from '@arco-design/web-react/es/Grid/grid-item';
import _ from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { checkTaskParamType } from '../../utils/check-task-param-type';
import { InputParamsValue } from '../InputParamsValue';
import { useCreatorStore } from '@src/create-task/store';
import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '@common/language';
import { getPopoverType } from '@src/params-config/utils/popover-type';

export const MultiParamsValue = () => {
  const [currentParamsConfig, updateCurrentConfig, allNodesOptions] =
    useCreatorStore(
      useShallow((state) => [
        state.currentParamsConfig,
        state.updateCurrentConfig,
        state.allNodesOptions,
      ]),
    );

  const { type } = currentParamsConfig;

  if (type !== 'group') {
    return null;
  }

  return (
    <Grid cols={2} colGap={12} rowGap={16} className="grid-demo-grid">
      {currentParamsConfig.values.map((config, index) => {
        const { type: configType, config_id, nodeId, internal_name } = config;
        const taskParamType = checkTaskParamType(
          allNodesOptions,
          config.nodeId,
          config.internal_name,
        );
        if (configType === 'file') {
          return (
            <GridItem key={config_id}>
              <div>{I18n.t('file', {}, '文件')}</div>
            </GridItem>
          );
        } else {
          return (
            <GridItem key={config_id}>
              <InputParamsValue
                popover={{
                  type: getPopoverType(taskParamType),
                  size: 'small',
                }}
                currentParamConfig={config}
                placeholder={`${internal_name}${languageUtils.getText(
                  TranslateKeys.BATCH_ADD_VALUES_PLACEHOLDER_SIMPLE,
                )}`}
                onChange={(value) => {
                  const deepClone = _.cloneDeep(currentParamsConfig);
                  deepClone.values[index].values = [
                    ...currentParamsConfig.values[index].values,
                    ...value,
                  ];
                  updateCurrentConfig({
                    values: deepClone.values,
                  });
                }}
              />
            </GridItem>
          );
        }
      })}
    </Grid>
  );
};
