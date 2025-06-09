// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { arrayMove } from 'react-sortable-hoc';

import _ from 'lodash';

import { SortableList } from './SortList';
import { type SortableCompProps } from './type';
import { useEffect, useRef } from 'react';

export const SortableComp: React.FC<SortableCompProps> = ({
  list,
  className,
  style,
  onChange,
}) => {
  const cleanupRef = useRef<NodeJS.Timeout>();
  const onSortEnd = ({
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    const items = _.cloneDeep(list);
    onChange(arrayMove(items, oldIndex, newIndex));
    // 延迟清理
    cleanupRef.current = setTimeout(() => {
      const clones = document.querySelectorAll('.ReactSortableHelper');
      clones.forEach((clone) => {
        if (clone.parentNode) {
          clone.parentNode.removeChild(clone);
        }
      });
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        clearTimeout(cleanupRef.current);
      }
    };
  }, []);

  return (
    <SortableList
      className={className}
      distance={2}
      style={style}
      list={list}
      onSortEnd={onSortEnd}
      onChange={onChange}
    />
  );
};
