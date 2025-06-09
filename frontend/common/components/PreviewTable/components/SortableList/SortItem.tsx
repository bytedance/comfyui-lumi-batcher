// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';
import { SortableElement } from 'react-sortable-hoc';

import { Checkbox, Popover } from '@arco-design/web-react';
import { IconDragDotVertical } from '@arco-design/web-react/icon';
import cn from 'classnames';

import { RenderCell } from '../RenderCell';
import styles from './index.module.scss';
import { RenderValue } from './Render';
import { type SortableItemProps } from './type';

import './index.scss';

// 创建可排序项
export const SortableItem = SortableElement<SortableItemProps>(
  ({ selected, value, onChange }: SortableItemProps) => {
    const Content = useMemo(
      () => <RenderCell cell={value} autoPlay />,
      [value],
    );
    return (
      <Popover
        trigger="hover"
        title={null}
        position="rt"
        content={Content}
        className={styles.popoverContainer}
        getPopupContainer={() => document.body}
      >
        <div
          style={{
            zIndex: 9999, // 确保拖拽元素在最上层
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 4,
            color: '#565856',
            userSelect: 'none',
            cursor: 'move',
          }}
          className={cn(styles.sortableItem, 'customDragItem')}
        >
          <IconDragDotVertical className={styles.dragIcon} />

          <Checkbox
            onChange={(v) => {
              onChange && onChange(v);
            }}
            checked={selected}
            className={styles.checkbox}
          />

          <RenderValue value={value} />
        </div>
      </Popover>
    );
  },
);
