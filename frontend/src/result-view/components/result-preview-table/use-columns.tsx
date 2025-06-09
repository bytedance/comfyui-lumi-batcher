// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { type ColumnProps } from '@arco-design/web-react/es/Table';
import { useShallow } from 'zustand/react/shallow';

import { useResultViewStore } from '../../store';
import { calcPercentSize } from '../../util';
import {
  CommonSeparator,
  getImageKey,
  getKey,
  getRenderCellType,
  getRenderCellValue,
} from './utils';
import { RenderCell } from '@common/components/PreviewTable/components/RenderCell';
import {
  PreviewTableRowDataType,
  PreviewTableCellValueType,
} from '@common/components/PreviewTable/type/table';
import { ConfigOption, ConfigOptionSimple } from '@common/type/result';

const findOrderIndex = (array: number[], num: number): number => {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (array[mid] === num) {
      return mid;
    } else if (array[mid] < num) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
};

export const useColumns = () => {
  const [
    detail,
    tableConfigOptions,
    selectedConfigOptionIndex,
    previewPercent,
  ] = useResultViewStore(
    useShallow((s) => [
      s.detail,
      s.tableConfigOptions,
      s.selectedConfigOptionIndex,
      s.previewPercent,
    ]),
  );

  const cellSize = calcPercentSize(300, 100, previewPercent);

  const columns: ColumnProps<PreviewTableRowDataType>[] = useMemo(() => {
    const res: ColumnProps<PreviewTableRowDataType>[] = [];
    const weights: number[] = [];

    if (selectedConfigOptionIndex === undefined) {
      return res;
    }

    // 处理列
    tableConfigOptions.forEach((item: ConfigOption, index) => {
      if (index === selectedConfigOptionIndex) {
        return;
      }
      if (item.type === 'group') {
        const c = item as {
          type: string;
          values: ConfigOptionSimple[];
        };
        const w = Math.max(...c.values.map((v) => v.values.length));
        const orderIndex = findOrderIndex(weights, w);
        weights.splice(orderIndex, 0, w);
        const nodeKey = c.values.map((v) => getKey(v)).join(CommonSeparator);
        const valueList: PreviewTableCellValueType = [
          {
            type: 'string',
            value: [nodeKey],
            label: '',
          },
        ];
        res.splice(orderIndex, 0, {
          title: <RenderCell cell={valueList} />,
          extra: {
            valueList,
            isParams: true,
            label: nodeKey,
          },
          dataIndex: nodeKey,
          fixed: 'left',
          width: cellSize,
          render(col: PreviewTableCellValueType, item) {
            // 定制渲染内容
            return (
              <RenderCell
                cell={col}
                defaultText={(item.batchTaskName as any) || '-'}
              />
            );
          },
        });
      } else {
        const c = item as ConfigOptionSimple;
        const w = c.values.length;
        const orderIndex = findOrderIndex(weights, w);
        weights.splice(orderIndex, 0, w);
        const nodeKey = getKey(c);
        const valueList: PreviewTableCellValueType = [
          {
            type: 'string',
            value: [nodeKey],
            label: '',
          },
        ];
        res.splice(orderIndex, 0, {
          title: <RenderCell cell={valueList} />,
          dataIndex: nodeKey,
          extra: {
            valueList,
            isParams: true,
            label: nodeKey,
          },
          fixed: 'left',
          width: cellSize,
          render(col: PreviewTableCellValueType, item) {
            // 定制渲染内容
            return (
              <RenderCell
                cell={col}
                defaultText={(item.batchTaskName as any) || '-'}
              />
            );
          },
        });
      }
    });

    // 处理选中的列
    const s = tableConfigOptions[selectedConfigOptionIndex as number];
    if (s.type === 'group') {
      const c = s as {
        type: string;
        values: ConfigOptionSimple[];
      };
      // 处理参数值组合数量，用于计算列数
      const maxLength = Math.max(...c.values.map((v) => v.values.length));
      const paramsConfigLength = c.values.length;
      const paramsTempArr = Array.from({ length: paramsConfigLength });
      for (let i = 0; i < maxLength; i++) {
        // 序列化key，用于列的dataIndex
        const dataIndex = paramsTempArr
          .map((_, index) => {
            const cc = c.values[index];
            return getKey(cc, String(cc.values[i]));
          })
          .join(CommonSeparator);
        const valueList: PreviewTableCellValueType = paramsTempArr.map(
          (_, ind) => {
            const cc = c.values[ind];
            const v = String(cc.values[i]);
            const imageKey = getImageKey(v);
            const imageSrc = detail?.resourcesMap[imageKey] ?? '';
            const t = getRenderCellType(imageKey);
            return {
              type: t,
              value: [getRenderCellValue(t, v, imageSrc) as string],
              label: getKey(cc),
            };
          },
        );
        res.push({
          title: <RenderCell cell={valueList} />,
          extra: {
            valueList,
            isParams: false,
            label: dataIndex,
          },
          width: cellSize,
          dataIndex,
          render(col) {
            return <RenderCell cell={col} />;
          },
        });
      }
    } else {
      const c = s as ConfigOptionSimple;
      c.values.forEach((item) => {
        const v = String(item);
        const imageKey = getImageKey(v);
        const imageSrc = detail?.resourcesMap[imageKey] ?? '';
        const t = getRenderCellType(imageKey);
        const valueList: PreviewTableCellValueType = [
          {
            type: t,
            value: [getRenderCellValue(t, v, imageSrc) as string],
            label: getKey(c),
          },
        ];
        const dataIndex = getKey(c, v);
        res.push({
          title: <RenderCell cell={valueList} />,
          extra: {
            valueList,
            isParams: false,
            label: dataIndex,
          },
          width: cellSize,
          dataIndex,
          render(col) {
            return <RenderCell cell={col} />;
          },
        });
      });
    }

    return res;
  }, [
    cellSize,
    detail?.resourcesMap,
    selectedConfigOptionIndex,
    tableConfigOptions,
  ]);

  return columns;
};
