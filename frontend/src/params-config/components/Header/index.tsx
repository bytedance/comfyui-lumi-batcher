// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo, useState } from 'react';

import { Button, Message, Space, Tag, Tooltip } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import './index.scss';
import { useCreatorStore } from '@src/create-task/store';
import { useParamsCheck } from '@src/create-task/utils/params-check';
import { uuid } from '@common/utils/uuid';
import { I18n } from '@common/i18n';
import AutoResizeInput from '@common/components/AutoResizeInput';
import { languageUtils, TranslateKeys } from '@common/language';

const showGuideTipKey = 'batch-tools-show-params-config-title-tip';

export const ParamsConfigHeader = () => {
  const isShowGuideTip = localStorage.getItem(showGuideTipKey);
  const [
    currentParamsConfig,
    closeParamsModal,
    paramsConfig,
    paramsEditMode,
    editIndex,
    updateCurrentConfig,
  ] = useCreatorStore(
    useShallow((state) => [
      state.currentParamsConfig,
      state.closeParamsModal,
      state.paramsConfig,
      state.paramsEditMode,
      state.editIndex,
      state.updateCurrentConfig,
    ]),
  );
  const [visible, setVisible] = useState(!isShowGuideTip);
  const { checkParamsConfig } = useParamsCheck();

  const { type } = currentParamsConfig;

  const paramCount = useMemo(
    () =>
      type === 'group'
        ? currentParamsConfig.values.length
        : Number(currentParamsConfig.internal_name ? 1 : 0),
    [currentParamsConfig, type],
  );

  const paramValueCount = useMemo(() => {
    let len = currentParamsConfig.values.length;
    if (type === 'group') {
      len = currentParamsConfig.values?.[0]?.values?.length ?? 0;
      currentParamsConfig.values.forEach((item) => {
        if (item.values?.length > len) {
          len = item.values.length;
        }
      });
    }
    return len;
  }, [currentParamsConfig, type]);

  const disabled = useMemo(() => {
    if (type === 'group') {
      return currentParamsConfig.values.every(
        (item) => item.values.length === 0 || !item.nodeId,
      );
    } else {
      return (
        currentParamsConfig.values.length === 0 || !currentParamsConfig.nodeId
      );
    }
  }, [currentParamsConfig, type]);

  const handleAdd = (isContinue = false) => {
    if (!checkParamsConfig()) {
      return;
    }

    paramsConfig.push(currentParamsConfig);

    useCreatorStore.setState({
      paramsConfig: [...paramsConfig],
      currentParamsConfig: {
        config_id: uuid(),
        type: currentParamsConfig.type,
        nodeId: undefined,
        internal_name: undefined,
        name: `${I18n.t('parameter_{placeholder1}', { placeholder1: paramsConfig.length + 1 }, '参数{placeholder1}')}`,
        values: [],
      },
      isShowValuesError: false,
    });

    if (!isContinue) {
      closeParamsModal?.();
    }
  };

  const handleUpdate = () => {
    if (!checkParamsConfig() || editIndex === -1) {
      return;
    }
    paramsConfig.splice(editIndex, 1, currentParamsConfig);
    useCreatorStore.setState({
      paramsConfig: [...paramsConfig],
      isShowValuesError: false,
    });
    closeParamsModal?.();
  };

  const handleCancelled = () => {
    useCreatorStore.setState({
      isShowValuesError: false,
    });
    closeParamsModal?.();
  };

  useEffect(() => {
    setVisible(!isShowGuideTip);
    setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => {
      localStorage.setItem(showGuideTipKey, 'true');
    };
  }, []);

  return (
    <div className="params-config-header">
      <Space className="params-config-header-left">
        <Tooltip
          position="bl"
          content={I18n.t(
            'support_custom_naming__which_is_convenient_for_you_to_manage_and_filter_the_grap',
            {},
            '支持自定义命名，便于你管理和跑图结果筛选。未命名则系统随机分配～',
          )}
          popupVisible={visible}
          getPopupContainer={() => document.body}
        >
          <AutoResizeInput
            tooltipProps={{
              position: 'bl',
              getPopupContainer: () => document.body,
            }}
            maxWidth={500}
            value={currentParamsConfig.name}
            onChange={(value) => {
              if (!value) {
                Message.error(
                  I18n.t(
                    'parameter_name_cannot_be_empty',
                    {},
                    '参数名称不能为空',
                  ),
                );
                return;
              }
              updateCurrentConfig({
                name: value,
              });
            }}
          />
        </Tooltip>
        <Tag className="tag">
          {languageUtils.getText(TranslateKeys.PARAMS_COUNT)}：{paramCount}
        </Tag>
        <Tag className="tag">
          {languageUtils.getText(TranslateKeys.PARAMS_COPIES)}：
          {paramValueCount}
        </Tag>
      </Space>
      <Space className="params-config-header-right">
        {paramsEditMode === 'edit' ? (
          <>
            <Button
              className={'params-config-header-cancel-button'}
              type="outline"
              status="default"
              onClick={handleCancelled}
              disabled={disabled}
            >
              {I18n.t('cancel', {}, '取消')}
            </Button>
            <Button type="primary" onClick={handleUpdate} disabled={disabled}>
              {I18n.t('save', {}, '保存')}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="outline"
              status="default"
              onClick={() => handleAdd(true)}
              disabled={disabled}
              className={'params-config-header-continue-button'}
            >
              {languageUtils.getText(TranslateKeys.SAVE_PARAM_CONFIG_CONTINUE)}
            </Button>
            <Button
              type="primary"
              onClick={() => handleAdd()}
              disabled={disabled}
            >
              {languageUtils.getText(TranslateKeys.SAVE_PARAM_CONFIG)}
            </Button>
          </>
        )}
      </Space>
    </div>
  );
};
