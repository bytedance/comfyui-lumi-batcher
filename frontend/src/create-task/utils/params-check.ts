// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Message } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import { useCreatorStore } from '../store';
import { getNodeInfoKey } from './get-node-info';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { I18n } from '@common/i18n';
import { getType } from '@common/utils/value-type';

/** 参数编辑、创建、另存为数据集时的参数校验 */
export const useParamsCheck = () => {
  const [currentParamsConfig, currentNodeInfoMap] = useCreatorStore(
    useShallow((state) => [
      state.currentParamsConfig,
      state.currentNodeInfoMap,
    ]),
  );

  const { type } = currentParamsConfig;
  const checkParamsValues = () => {
    const { values } = currentParamsConfig;
    let status = true;
    const checkSingleParam = (paramConfig: ParamsConfigTypeItem) => {
      if (!paramConfig.nodeId) {
        return;
      }
      const paramType =
        currentNodeInfoMap[getNodeInfoKey(paramConfig)]?.paramType;
      const s = paramConfig.values.every(
        (value) => getType(value) === paramType,
      );
      if (!s) {
        status = false;
      }
    };
    if (type === 'group') {
      values.forEach((item) => {
        checkSingleParam(item);
      });
    } else {
      checkSingleParam(currentParamsConfig);
    }

    if (!status) {
      useCreatorStore.setState({
        isShowValuesError: true,
      });
      Message.error(
        I18n.t(
          'the_parameter_type_check_failed__please_check_the_parameter_configuration~',
          {},
          '参数类型检查不通过，请检查参数配置~',
        ),
      );
    }

    return status;
  };

  const checkParamsConfig = (): boolean => {
    let status = checkParamsValues();
    if (!status) {
      return status;
    }
    // 参数合法性检查
    if (type === 'group') {
      if (
        currentParamsConfig.values.some(
          (item) =>
            item.values.length !== currentParamsConfig.values[0].values.length,
        )
      ) {
        Message.error(
          I18n.t(
            'the_number_of_parameter_values_in_the_combination_parameter_does_not_correspond',
            {},
            '组合参数中参数值数量对应不上',
          ),
        );
        status = false;
      } else if (
        currentParamsConfig.values.some((item) => !item.values.length)
      ) {
        Message.error(
          I18n.t(
            'the_number_of_parameter_values_cannot_be_0_',
            {},
            '参数值份数不能为0',
          ),
        );
        status = false;
      } else if (currentParamsConfig.values.length < 2) {
        Message.error(
          I18n.t(
            'combine_parameters_(bundled)_select_at_least_two_parameters',
            {},
            '组合参数（捆绑）至少选择两个参数',
          ),
        );
        status = false;
      }
    } else {
      if (!currentParamsConfig.values.length) {
        Message.error(
          I18n.t(
            'the_number_of_parameter_values_cannot_be_0_',
            {},
            '参数值份数不能为0',
          ),
        );
        status = false;
      }
    }
    return status;
  };

  return {
    checkParamsValues,
    checkParamsConfig,
  };
};
