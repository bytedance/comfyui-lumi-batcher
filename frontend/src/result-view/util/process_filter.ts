// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type ColumnProps } from '@arco-design/web-react/es/Table';

import { useResultViewStore } from '../store';
import { getTableConfigOptions } from '.';
import { AdvancedFilterItem } from '@common/components/PreviewTable/components/AdvancedFilter/type';
import {
  PreviewTableRowDataType,
  PreviewTableDataType,
} from '@common/components/PreviewTable/type/table';
import { I18n } from '@common/i18n';

export const processColumns = (
  columns: ColumnProps<PreviewTableRowDataType>[],
): Array<AdvancedFilterItem> => {
  const { selectedConfigOptionIndex, tableConfigOptions } =
    useResultViewStore.getState();
  if (
    !columns ||
    columns.length === 0 ||
    selectedConfigOptionIndex === undefined
  ) {
    return [];
  }

  /** 表格配置可选项 */
  const configOptions = getTableConfigOptions(tableConfigOptions);
  const paramsColumns = columns.filter((column) => column.extra?.isParams);
  const valueColumns = columns.filter((column) => !column.extra?.isParams);
  return [
    ...paramsColumns.map((column: ColumnProps<PreviewTableRowDataType>) => ({
      id: column.dataIndex,
      label: column.extra?.label,
      selected: true,
      expanded: true,
      options: [
        {
          id: column.dataIndex,
          selected: true,
          value: column.extra?.valueList,
        },
      ],
    })),
    {
      label: configOptions[selectedConfigOptionIndex]?.value,
      id: configOptions[selectedConfigOptionIndex]?.value,
      selected: true,
      expanded: true,
      options: valueColumns.map(
        (column: ColumnProps<PreviewTableRowDataType>) => ({
          id: column.dataIndex,
          selected: true,
          value: column.extra?.valueList,
        }),
      ),
    },
  ] as unknown as Array<AdvancedFilterItem>;
};

export const processRows = (
  data: PreviewTableDataType,
  column: ColumnProps<PreviewTableRowDataType>[],
) => {
  const paramsColumns =
    column
      ?.filter((column) => column.extra?.isParams)
      ?.map((column) => column.dataIndex) || [];

  return [
    {
      id: 'row_data',
      label: I18n.t('row_data', {}, '行数据'),
      selected: true,
      expanded: true,
      options: data.map((item) => {
        const values: any[] = [];
        paramsColumns.forEach((key) => {
          if (key) {
            values.push(...item[key]);
          }
        });
        return {
          id: item.id,
          filterKeys: item.custom_params_config_filters,
          selected: true,
          value: values,
        };
      }),
    },
  ] as Array<AdvancedFilterItem>;
};
