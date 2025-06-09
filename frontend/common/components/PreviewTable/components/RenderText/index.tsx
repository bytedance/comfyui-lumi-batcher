// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useMemo, useRef } from 'react';

import { Typography } from '@arco-design/web-react';
import { isNil, isString } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { usePreviewTableStore } from '../../store';
import { type AtomValueType } from '../../type/table';
import styles from './index.module.scss';
import { uuid } from '@common/utils/uuid';

export const RenderText: React.FC<{
  value: AtomValueType;
  isOnlyText?: boolean;
}> = ({ value, isOnlyText = false }) => {
  const { value: textList, label } = value;
  const ref = useRef<HTMLDivElement>(null);
  const [cellSize] = usePreviewTableStore(useShallow((s) => [s.cellSize]));

  const rows = useMemo(() => Math.max(Math.ceil(cellSize / 24), 2), [cellSize]);

  if (
    textList.length === 0 ||
    textList.every(
      (item) => isNil(item) || (isString(item) && item.trim().length <= 0),
    )
  ) {
    return <>-</>;
  }

  return (
    <div className={styles.container}>
      {textList.map((item) => (
        <div key={uuid()} className={styles.block} ref={ref}>
          {label ? (
            <Typography.Ellipsis
              className={styles.label}
              rows={1}
              showTooltip
              expandable
            >
              {label}
            </Typography.Ellipsis>
          ) : null}

          <Typography.Ellipsis
            className={styles.value}
            rows={isOnlyText ? rows : 2}
            showTooltip={{
              getPopupContainer: () => document.body,
            }}
          >
            {item}
          </Typography.Ellipsis>
        </div>
      ))}
    </div>
  );
};
