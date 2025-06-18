// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo, useState } from 'react';

import {
  Button,
  Space,
  Table,
  type TableColumnProps,
} from '@arco-design/web-react';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import cn from 'classnames';
import _ from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import valuesEmptyGuide from '../../../../static/img/values-empty-guide.png';
import valuesEmptyGuideEn from '../../../../static/img/values-empty-guide-en.png';

import { InputParamsValue } from '../InputParamsValue';
import { ParamsValuePreview } from '../ParamsValuePreview';

import './index.scss';
import { useCreatorStore } from '@src/create-task/store';
import {
  getNodeInfoKey,
  NodeInfo,
  validateValueType,
} from '@src/create-task/utils/get-node-info';
import { I18n } from '@common/i18n';
import { uuid } from '@common/utils/uuid';
import { LanguagesEnum, languageUtils, TranslateKeys } from '@common/language';
import { formatSerialNumber } from '@common/utils/text';
import { BrandName } from '@common/constant/batch';
import { createWithPrefix } from '@common/utils/create-with-prefix';

const withPrefix = createWithPrefix(BrandName);

export const ParamsValueList = () => {
  const [
    currentParamsConfig,
    currentNodeInfoMap,
    isShowValuesError,
    updateCurrentConfig,
  ] = useCreatorStore(
    useShallow((state) => [
      state.currentParamsConfig,
      state.currentNodeInfoMap,
      state.isShowValuesError,
      state.updateCurrentConfig,
    ]),
  );

  const [editStatusMap, setEditStatusMap] = useState<Record<string, boolean>>(
    {},
  );

  const { type } = currentParamsConfig;

  const updateEditStatus = (config_id: string, status: boolean) => {
    setEditStatusMap((data) => ({
      ...data,
      [config_id]: status,
    }));
  };

  const EditParamsValue = (props: {
    id: string;
    value: string;
    nodeId?: string | number;
    internal_name?: string;
    index: number;
  }) => {
    const { id, value, internal_name = '', index, nodeId } = props;
    const nodeInfo =
      (nodeId ? currentNodeInfoMap[getNodeInfoKey(props as any)] : '') ||
      ({} as NodeInfo);

    return (
      <div className={cn('params-values-edit-value')}>
        {editStatusMap[id] ? (
          <InputParamsValue
            size="default"
            enterFrom="single-input"
            currentParamConfig={props as any}
            noSplit
            placeholder={`${I18n.t('{internal_name}_value__enter_key_to_submit', { internal_name }, '{internal_name}值，enter键提交')}`}
            defaultValue={value}
            onChange={(v) => {
              const temp = _.cloneDeep(currentParamsConfig);
              if (type === 'group') {
                const subIndex = temp.values.findIndex(
                  (i) =>
                    i.nodeId === nodeId && i.internal_name === internal_name,
                );
                temp.values[subIndex].values[index] =
                  v instanceof Array ? v[0] : v;
              } else {
                temp.values[index] = v instanceof Array ? v[0] : v;
              }
              updateCurrentConfig({
                values: temp.values,
              });
              updateEditStatus(id, false);
            }}
          />
        ) : (
          <div className="params-values-preview-container">
            <ParamsValuePreview
              value={value}
              height={32}
              width={32}
              isError={
                isShowValuesError
                  ? !validateValueType(value, nodeInfo.paramType)
                  : false
              }
            />
          </div>
        )}
      </div>
    );
  };

  const currentColumns = useMemo(() => {
    const columns: TableColumnProps[] = [
      {
        title: <>{I18n.t('serial_number', {}, '序号')}</>,
        width: 100,
        fixed: 'left',
        render: (col, item, index) => (
          <span>{formatSerialNumber(index + 1)}</span>
        ),
      },
    ];
    if (type === 'group') {
      currentParamsConfig.values?.forEach((item) => {
        columns.push({
          title: item.internal_name,
          dataIndex: `${item.config_id}value`,
          width: 200,
          render(col, i, index) {
            return (
              <EditParamsValue
                id={i.id}
                nodeId={item.nodeId}
                value={i[`${item.config_id}value`]}
                internal_name={item.internal_name}
                index={index}
              />
            );
          },
        });
      });
    } else {
      columns.push({
        className: 'params-values-table-cell',
        title: currentParamsConfig.internal_name,
        dataIndex: `${currentParamsConfig.config_id}value`,
        width: 200,
        render(col, item, index) {
          return (
            <EditParamsValue
              id={item.id}
              nodeId={currentParamsConfig.nodeId}
              value={item[`${currentParamsConfig.config_id}value`]}
              internal_name={currentParamsConfig.internal_name}
              index={index}
            />
          );
        },
      });
    }

    columns.push({
      title: <>{I18n.t('operation', {}, '操作')}</>,
      fixed: 'right',
      width: 100,
      render(col, item, index) {
        const handleDelete = () => {
          if (type === 'group') {
            currentParamsConfig.values?.forEach((p) => {
              p.values.splice(index, 1);
            });
          } else {
            currentParamsConfig.values.splice(index, 1);
          }
          useCreatorStore.setState({
            currentParamsConfig: {
              ...currentParamsConfig,
            },
          });
        };
        return (
          <Space>
            <Button
              shape="circle"
              icon={<IconEdit />}
              size="mini"
              onClick={() => {
                setEditStatusMap((data) => ({
                  ...data,
                  [item.id]: true,
                }));
              }}
            />
            <Button
              shape="circle"
              icon={<IconDelete />}
              size="mini"
              onClick={handleDelete}
            />
          </Space>
        );
      },
    });

    return columns;
  }, [currentParamsConfig, editStatusMap, isShowValuesError]);

  const currentData = useMemo(() => {
    const data: { [k in string]: string }[] = [];
    if (type === 'group') {
      currentParamsConfig.values?.forEach((item) => {
        item.values?.forEach((i, ind) => {
          if (!data[ind]) {
            data.push({
              [`${item.config_id}value`]: i,
              id: uuid(),
            });
          } else {
            data[ind][`${item.config_id}value`] = i;
          }
        });
      });
    } else {
      currentParamsConfig.values?.forEach((item) => {
        data.push({
          [`${currentParamsConfig.config_id}value`]: item,
          id: uuid(),
          nodeId: currentParamsConfig.nodeId,
        });
      });
    }
    return data;
  }, [currentParamsConfig]);

  const showGuide = useMemo(() => {
    if (type === 'group') {
      return currentParamsConfig.values.some(
        (item) => item?.values?.length > 0,
      );
    }
    return currentParamsConfig.values.length > 0;
  }, [currentParamsConfig]);

  const TableContent = useMemo(() => {
    if (!showGuide) {
      return (
        <img
          className="img"
          src={
            languageUtils.getLanguage() === LanguagesEnum.EN
              ? valuesEmptyGuideEn
              : valuesEmptyGuide
          }
          alt=""
        />
      );
    } else {
      return (
        <Table
          rowKey="id"
          className={withPrefix('params-value-list-table')}
          columns={currentColumns}
          data={currentData}
          pagination={false}
          scroll={{
            x: 500,
            y: true,
          }}
        />
      );
    }
  }, [currentData, currentColumns]);

  return (
    <div className={withPrefix('params-value-list')}>
      <div className="title-container">
        <span className="title">
          {languageUtils.getText(TranslateKeys.PARAM_LIST)}
        </span>
      </div>
      {TableContent}
    </div>
  );
};
