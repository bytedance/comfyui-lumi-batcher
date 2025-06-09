// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo } from 'react';

import { Form, Radio } from '@arco-design/web-react';
import Col from '@arco-design/web-react/es/Grid/col';
import Row from '@arco-design/web-react/es/Grid/row';
import { useShallow } from 'zustand/react/shallow';

import { checkTaskParamType } from '../../utils/check-task-param-type';
import { InputParamsValue } from '../InputParamsValue';
import { MultiParamsValue } from '../MultiParamsValue';
import { ParamsSelect } from '../ParamsSelect';
import { ParamsValueList } from '../ParamsValueList';

import './index.scss';
import { languageUtils, TranslateKeys } from '@common/language';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { useCreatorStore } from '@src/create-task/store';
import { I18n } from '@common/i18n';

const RadioGroup = Radio.Group;

export const ParamsConfigContent = () => {
  const [currentParamsConfig, allNodesOptions] = useCreatorStore(
    useShallow((state) => [state.currentParamsConfig, state.allNodesOptions]),
  );

  const [form] = Form.useForm();

  const { type } = currentParamsConfig;

  useEffect(() => {
    useCreatorStore.setState({
      form,
    });
  }, [form]);

  const handleUpdateCurrentConfig = (obj: Partial<ParamsConfigTypeItem>) => {
    useCreatorStore.setState({
      currentParamsConfig: Object.assign({}, currentParamsConfig, obj),
    });
  };

  const ParamsValueContent = useMemo(() => {
    const taskParamType = checkTaskParamType(
      allNodesOptions,
      currentParamsConfig.nodeId,
      currentParamsConfig.internal_name,
    );
    if (type === 'group') {
      if (!currentParamsConfig.values?.length) {
        return null;
      }
      return (
        <Form.Item label={I18n.t('parameter_value_', {}, '参数值：')}>
          <MultiParamsValue />
        </Form.Item>
      );
    } else {
      if (!currentParamsConfig.internal_name) {
        return null;
      }
      return (
        <Form.Item label={I18n.t('parameter_value_', {}, '参数值：')}>
          <InputParamsValue
            currentParamConfig={currentParamsConfig}
            popover={{
              type:
                taskParamType === 'video'
                  ? 'zip_video'
                  : taskParamType === 'image'
                    ? 'zip_image'
                    : 'xlsx',
              size: 'large',
            }}
            onChange={(value) => {
              handleUpdateCurrentConfig({
                values: [...currentParamsConfig.values, ...value],
              });
            }}
            placeholder={`${
              currentParamsConfig.internal_name
            }${languageUtils.getText(
              TranslateKeys.BATCH_ADD_VALUES_PLACEHOLDER,
            )}`}
          />
        </Form.Item>
      );
    }
  }, [currentParamsConfig]);

  return (
    <div className="params-config-content">
      <Form
        form={form}
        size="default"
        autoComplete="off"
        initialValues={{
          ...currentParamsConfig,
        }}
        className="params-config-content-form"
        labelCol={{
          style: {
            width: 'fit-content',
            flex: 'unset',
            flexShrink: 0,
          },
        }}
        wrapperCol={{
          flex: '1',
          style: {
            // overflow: 'hidden',
          },
        }}
      >
        <Row>
          <Form.Item
            label={I18n.t('type_', {}, '类型：')}
            field="type"
            className="test"
          >
            <RadioGroup
              defaultValue="normal"
              onChange={(v) => {
                handleUpdateCurrentConfig({
                  type: v,
                  internal_name: '',
                  nodeId: '',
                  values: [],
                });
              }}
            >
              <Radio value="data">
                {languageUtils.getText(TranslateKeys.SINGLE_PARAM_TEXT)}
              </Radio>
              <Radio value="group">
                {languageUtils.getText(TranslateKeys.GROUP_PARAM_TEXT)}
              </Radio>
            </RadioGroup>
          </Form.Item>
        </Row>
        <Row gutter={24}>
          <Col span={12} className="params-config-form-item-wrapper">
            <Form.Item
              label={I18n.t('parameter_', {}, '参数：')}
              style={{ flexWrap: 'nowrap' }}
            >
              <ParamsSelect />
            </Form.Item>
          </Col>
          <Col span={12}>{ParamsValueContent}</Col>
        </Row>
      </Form>
      <ParamsValueList />
    </div>
  );
};
