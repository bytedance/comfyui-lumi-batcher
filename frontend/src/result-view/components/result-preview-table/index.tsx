// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useResultViewStore } from '../../store';
import { calcPercentSize } from '../../util';
import { processColumns, processRows } from '../../util/process_filter';
import styles from './index.module.scss';
import { useColumns } from './use-columns';
import { useData } from './use-data';
import useResize from '@common/hooks/use-resize';
import { customCompare } from '@common/components/PreviewTable/utils/compare';
import { PreviewTable } from '@common/components/PreviewTable';
import { memoryMap } from '@common/utils/advanced-map';
import { orderColumns, orderRows } from './order';

export const ResultPreviewTable = () => {
  const height = useResize(() => window.innerHeight - 60 - 76);
  const [previewPercent, customColumns, customRows] = useResultViewStore(
    useShallow((s) => [s.previewPercent, s.customColumns, s.customRows]),
  );

  const data = useData();
  const columns = useColumns();
  const cellSize = calcPercentSize(300, 100, previewPercent);

  useEffect(() => {
    // 处理高级筛选中的行
    const r = processRows(data, columns);
    const c = processColumns(columns);
    useResultViewStore.setState({
      customRows: r,
      originRows: r,
      customColumns: c,
      originColumns: c,
    });
  }, [data, columns]);

  const finalColumns = useMemo(() => {
    // 创建配置映射表
    const configMap = new Map();
    // 自增序号
    let count = 1;

    const { set: configMapSet } = memoryMap(configMap);

    customColumns.forEach((cc) => {
      if (cc.options?.length > 1) {
        cc.options?.forEach((opt) => {
          configMapSet(opt.id, { ...opt, order: count++ });
        });
      } else {
        configMapSet(cc.id, { ...cc, order: count++ });
      }
    });

    const { get: filterConfigGet } = memoryMap(configMap);
    const { get: orderConfigGet } = memoryMap(configMap);

    return orderColumns(columns, orderConfigGet).filter((c) => {
      const config = filterConfigGet(c.dataIndex || '');
      return config?.selected !== false;
    });
  }, [columns, customColumns]);

  const finalData = useMemo(() => {
    // 创建配置映射表
    const configMap = new Map();
    let count = 0;
    const { set: configMapSet } = memoryMap(configMap);
    customRows.forEach((cc) => {
      configMapSet(cc.id, { ...cc, order: count++ });
      cc.options?.forEach((opt) => {
        configMapSet(opt.id, { ...opt, order: count++ });
      });
    });

    const { get: filterConfigGet } = memoryMap(configMap);
    const { get: orderConfigGet } = memoryMap(configMap);

    return orderRows(data, orderConfigGet).filter((d) => {
      const config = filterConfigGet(d.id);
      return config?.selected !== false;
    });
  }, [data, customRows]);

  useEffect(() => {
    useResultViewStore.setState({
      customColumnsChanged: !customCompare(columns, finalColumns),
      customRowsChanged: !customCompare(data, finalData),
    });
  }, [finalColumns, finalData, data, columns]);

  return (
    <div className={styles.content} style={{ height }}>
      <PreviewTable
        data={finalData}
        cellSize={cellSize}
        columnList={finalColumns}
        cellValue2UrlMap={undefined}
        renderRect={{
          height,
        }}
      />
    </div>
  );
};
