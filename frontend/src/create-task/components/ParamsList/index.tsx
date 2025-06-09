// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import {
  Button,
  Popconfirm,
  Space,
  Table,
  type TableColumnProps,
} from '@arco-design/web-react';
import { IconDelete, IconEdit } from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';

import { useCreatorStore } from '../../store';
import { ParamsCards } from '../ParamsCards';

import './index.scss';
import { I18n } from '@common/i18n';
import {
  ParamsListDisplayMode,
  ParamsTypeLabelMap,
} from '@common/constant/creator';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { ContentEmpty } from '@common/components/ContentEmpty';
import { languageUtils, TranslateKeys } from '@common/language';

export const ParamsList = () => {
  const [
    paramsConfig,
    paramsListDisplayMode,
    updateParamsConfig,
    deleteParamsConfig,
  ] = useCreatorStore(
    useShallow((s) => [
      s.paramsConfig,
      s.paramsListDisplayMode,
      s.updateParamsConfig,
      s.deleteParamsConfig,
    ]),
  );

  const columns: TableColumnProps[] = useMemo(
    () => [
      {
        title: I18n.t('parameter_name', {}, '参数名'),
        dataIndex: 'name',
        width: 200,
        render(col: string) {
          return <span>{col}</span>;
        },
      },
      {
        title: I18n.t('type', {}, '类型'),
        dataIndex: 'type',
        width: 200,
        render(col: string) {
          return <span>{ParamsTypeLabelMap[col]}</span>;
        },
      },
      {
        title: I18n.t('parameter', {}, '参数'),
        width: 200,
        render(col, item: ParamsConfigTypeItem) {
          let str = '';
          if (item.type === 'group') {
            str = item.values.map((i) => i.internal_name).toString();
          } else {
            str = item.internal_name || '';
          }
          return <span>{str}</span>;
        },
      },
      {
        title: languageUtils.getText(TranslateKeys.PARAMS_COPIES),
        width: 200,
        render(_, item: ParamsConfigTypeItem) {
          return (
            <span>
              {item.type === 'group'
                ? item.values[0]?.values?.length
                : item.values.length}
            </span>
          );
        },
      },
      {
        title: I18n.t('source', {}, '来源'),
        dataIndex: '',
        width: 200,
        render(col: string, item) {
          return (
            <span>
              {item.dataset_id
                ? I18n.t('dataset_import', {}, '数据集导入')
                : I18n.t('custom_parameters', {}, '自定义参数')}
            </span>
          );
        },
      },
      {
        title: I18n.t('operation', {}, '操作'),
        width: 200,
        render(col, item: ParamsConfigTypeItem, index) {
          return (
            <Space>
              <Button
                shape="circle"
                icon={<IconEdit />}
                size="mini"
                onClick={() => {
                  updateParamsConfig(item, index);
                }}
              />
              <Popconfirm
                title={I18n.t(
                  'are_you_sure_to_delete_this_parameter?',
                  {},
                  '确认删除该参数吗？',
                )}
                onOk={() => deleteParamsConfig(index)}
              >
                <Button shape="circle" icon={<IconDelete />} size="mini" />
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [deleteParamsConfig, updateParamsConfig],
  );

  const ListContent = useMemo(
    () =>
      paramsListDisplayMode === ParamsListDisplayMode.CARDS ? (
        <ParamsCards />
      ) : (
        <Table
          className="table"
          rowKey="config_id"
          columns={columns}
          data={paramsConfig}
          pagination={false}
        />
      ),
    [paramsListDisplayMode, paramsConfig, columns],
  );

  return (
    <div className="params-list-container">
      {paramsConfig.length > 0 ? ListContent : <ContentEmpty />}
    </div>
  );
};
