// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { useResultViewStore } from '../../store';
import { processTasks } from './process-tasks';
import {
  CommonSeparator,
  getImageKey,
  getKey,
  getRenderCellType,
  getRenderCellValue,
} from './utils';
import { PreviewTableDataType } from '@common/components/PreviewTable/type/table';
import { ConfigOption, ConfigOptionSimple } from '@common/type/result';
import { GetRoomResultsResponse } from '@api/result';
import { processResult } from '@common/utils/transfer/task-result';

const CustomParamsConfigFilters = 'custom_params_config_filters';

export const useData = () => {
  const [detail, tableConfigOptions, selectedConfigOptionIndex] =
    useResultViewStore(
      useShallow((s) => [
        s.detail,
        s.tableConfigOptions,
        s.selectedConfigOptionIndex,
      ]),
    );
  const tableData = useMemo(() => {
    if (!detail || selectedConfigOptionIndex === undefined) {
      return [];
    }
    let res: PreviewTableDataType = [];
    // 构建表格，填充批量参数配置涉及的行数据
    tableConfigOptions.forEach((item, index) => {
      if (index === selectedConfigOptionIndex) {
        return;
      }
      if (res.length === 0) {
        res.push(...processConfigToData(item, detail));
      } else {
        const resNew = processConfigToData(item, detail);
        const finalRes: PreviewTableDataType = [];
        res.forEach((item) => {
          resNew.forEach((itemNew) => {
            finalRes.push({
              ...item,
              ...itemNew,
              id: `${item.id}${CommonSeparator}${itemNew.id}`,
              [CustomParamsConfigFilters]: [
                ...item[CustomParamsConfigFilters],
                ...itemNew[CustomParamsConfigFilters],
              ],
            } as any);
          });
        });

        res = finalRes;
      }
    });

    // 填充当前所选对比维度涉及的列数据
    const s = tableConfigOptions[selectedConfigOptionIndex] as ConfigOption;
    // 根据当前res数据，涉及到的id索引，通过序列化的任务key找到每个单元格对应的数据，同时构建表格所需数据
    let cases: Array<string> = [];
    if (s.type === 'group') {
      const c = s as {
        type: string;
        values: ConfigOptionSimple[];
      };
      // 处理参数值组合数量，用于计算列数，假定所有项都是1对1的
      const maxLength = Math.max(...c.values.map((v) => v.values.length));
      const tempArr = Array.from({ length: maxLength });
      cases = tempArr.map((_, index) =>
        c.values
          .map((v) => getKey(v, String(v.values[index])))
          .join(CommonSeparator),
      );
    } else {
      const c = s as ConfigOptionSimple;
      cases = c.values.map((i) => getKey(c, String(i)));
    }
    // 不存在res时，且有数据时，需要手动创建一个空行
    if (!res.length && detail.results && detail.results.length > 0) {
      const id =
        s.type === 'group'
          ? (s.values as ConfigOptionSimple[])
              .map((v) => getKey(v))
              .join(CommonSeparator)
          : getKey(s as ConfigOptionSimple);
      res = [{ id }] as any;
    }

    res = processTasksToData(res, cases, detail);

    return res;
  }, [detail, tableConfigOptions, selectedConfigOptionIndex]);

  return tableData;
};

const processConfigToData = (
  item: ConfigOption,
  detail: GetRoomResultsResponse,
) => {
  const res: PreviewTableDataType = [];

  if (item.type === 'group') {
    const c = item as {
      type: string;
      values: ConfigOptionSimple[];
    };
    // 参数值数量，用于计算行数
    const maxLength = Math.max(...c.values.map((v) => v.values.length));

    //   由参数节点组成的唯一key，暂时不带value
    const key = c.values.map((v) => getKey(v)).join(CommonSeparator);

    // 根据规则获取每行的行数据
    for (let i = 0; i < maxLength; i++) {
      const uniqueKey = c.values
        .map((v) => getKey(v, String(v.values[i])))
        .join(CommonSeparator);

      res.push({
        id: uniqueKey,
        [CustomParamsConfigFilters]: [uniqueKey],
        [key]: Array.from({ length: item.values.length }).map((_, ind) => {
          const cc = c.values[ind];
          const v = String(cc.values[i]);
          const imageKey = getImageKey(v);
          const imageSrc = detail.resourcesMap[imageKey] ?? '';
          const t = getRenderCellType(imageKey);
          return {
            type: t,
            value: [getRenderCellValue(t, v, imageSrc)],
            label: getKey(cc),
          };
        }),
      } as any);
    }
  } else {
    const c = item as ConfigOptionSimple;
    c.values.forEach((v) => {
      const value = String(v);
      const key = getKey(c);
      const imageKey = getImageKey(value);
      const imageSrc = detail.resourcesMap[imageKey] ?? '';
      const t = getRenderCellType(imageKey);
      const uniqueKey = getKey(c, value);
      res.push({
        id: uniqueKey,
        [CustomParamsConfigFilters]: [uniqueKey],
        [key]: [
          {
            type: t,
            value: [getRenderCellValue(t, v, imageSrc)],
            label: getKey(c),
          },
        ],
      } as any);
    });
  }

  return res;
};

const processTasksToData = (
  res: PreviewTableDataType,
  cases: Array<string>,
  detail: GetRoomResultsResponse,
): PreviewTableDataType => {
  const { resultMap, configMap } = processTasks(detail.results);
  const result = res;

  return result.map((item) => {
    cases.forEach((c) => {
      const filters = (
        (item[CustomParamsConfigFilters] ?? []) as any as Array<string>
      )
        .concat(c)
        .filter((item) => item);
      const key = Object.keys(configMap).find((k) =>
        filters.every((f) => configMap[k].includes(f)),
      );
      if (key) {
        const value = resultMap[key];
        (item as any)[c] = processResult(value);
      }
    });
    return item;
  }) as any;
};
