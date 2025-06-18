// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { Divider } from '@arco-design/web-react';
import { isNumber } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import ConfigTableParams from '../../../../common/components/PreviewTable/components/config-table-params';
import { useResultViewStore } from '../../store';
import { concatKeys, getTableConfigOptions } from '../../util';
import ConfigTableSlider from '../config-table-slider';
import styles from './index.module.scss';
import { AdvancedFilterItem } from '@common/components/PreviewTable/components/AdvancedFilter/type';
import Flex from '@common/components/Flex';
import ResultDownload from '@src/result-download';
import AutoResizeInput from '@common/components/AutoResizeInput';
import { AdvancedFilter } from '@common/components/PreviewTable/components/AdvancedFilter';
import { I18n } from '@common/i18n';

export default function Header() {
  const { setState } = useResultViewStore;
  const [
    taskId,
    name,
    tableConfigOptions,
    selectedConfigOptionIndex,
    customColumns,
    customRows,
    originColumns,
    originRows,
    customColumnsChanged,
    customRowsChanged,
  ] = useResultViewStore(
    useShallow((s) => [
      s.taskId,
      s.name,
      s.tableConfigOptions,
      s.selectedConfigOptionIndex,
      s.customColumns,
      s.customRows,
      s.originColumns,
      s.originRows,
      s.customColumnsChanged,
      s.customRowsChanged,
    ]),
  );

  const handleColumnFilter = (newArray: Array<AdvancedFilterItem>) => {
    useResultViewStore.setState({
      customColumns: newArray,
    });
  };

  const handleRowFilter = (newArray: Array<AdvancedFilterItem>) => {
    useResultViewStore.setState({
      customRows: newArray,
    });
  };

  /** 表格配置可选项 */
  const configOptions = useMemo(
    () => getTableConfigOptions(tableConfigOptions),
    [tableConfigOptions],
  );

  /** 表格配置已选择项 */
  const configValue = useMemo(
    () =>
      isNumber(selectedConfigOptionIndex)
        ? concatKeys(tableConfigOptions[selectedConfigOptionIndex])
        : undefined,
    [tableConfigOptions, selectedConfigOptionIndex],
  );

  const onNameUpdate = (value?: string) => {
    setState({
      name: (value || '').trim(),
    });
  };

  return (
    <Flex className={styles.container} justify="space-between">
      <div className={styles.config}>
        <ConfigTableParams
          options={configOptions}
          value={configValue}
          onSelect={(_, selectedIndex) => {
            setState({
              selectedConfigOptionIndex: selectedIndex,
            });
          }}
          shouldChangeConfirm={customColumnsChanged || customRowsChanged}
        />
        <AdvancedFilter
          label={I18n.t('custom_rows', {}, '自定义行')}
          list={customRows}
          onFilter={handleRowFilter}
          originList={originRows}
        />
        <AdvancedFilter
          label={I18n.t('custom_columns', {}, '自定义列')}
          list={customColumns}
          onFilter={handleColumnFilter}
          originList={originColumns}
        />
      </div>

      <AutoResizeInput
        className={styles.input}
        fontSize={14}
        maxWidth={240}
        maxLength={50}
        value={name}
        onChange={onNameUpdate}
      />

      <Flex align="center" gap={8}>
        <ConfigTableSlider />

        <Divider type="vertical" />

        <ResultDownload taskId={taskId} size="large" />
      </Flex>
    </Flex>
  );
}
