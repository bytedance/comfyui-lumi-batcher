// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { arrayMove } from 'react-sortable-hoc';

import _ from 'lodash';

import { SortableList } from './SortList';
import { type SortableCompProps } from './type';
import { useEffect, useRef } from 'react';
import { safeRemoveChild } from './utils';

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
    try {
      // 立即清理可能存在的残留DOM
      const clones = document.querySelectorAll('.ReactSortableHelper');
      clones.forEach((clone) => {
        safeRemoveChild(clone as HTMLElement);
      });

      // 延迟二次清理确保完全清除
      cleanupRef.current = setTimeout(() => {
        const remainingClones = document.querySelectorAll(
          '.ReactSortableHelper',
        );
        remainingClones.forEach((clone) => {
          safeRemoveChild(clone as HTMLElement);
        });
      }, 200);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
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
