// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { SortableContainer } from 'react-sortable-hoc';

import cn from 'classnames';
import _ from 'lodash';

import styles from './index.module.scss';
import { SortableItem } from './SortItem';
import { type SortableListProps } from './type';
// 创建可排序容器
export const SortableList = SortableContainer<SortableListProps>(
  ({ list, onChange, className, style }: SortableListProps) => {
    const handleChange = (selected: boolean, index: number) => {
      const newArray = _.cloneDeep(list);
      newArray[index].selected = selected;
      onChange(newArray);
    };
    return (
      <div className={cn(styles.listContainer, className)} style={style}>
        {list.map((item, index) => (
          <SortableItem
            key={`${item.id}-${index}`}
            onChange={(selected: boolean) => {
              handleChange(selected, index);
            }}
            id={item.id}
            selected={item.selected}
            value={item.value}
            index={index}
          />
        ))}
      </div>
    );
  },
);
