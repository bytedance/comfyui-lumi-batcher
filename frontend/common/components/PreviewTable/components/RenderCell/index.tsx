// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type FunctionComponent, useMemo } from 'react';

import {
  type AtomValueType,
  type PreviewTableCellValueType,
} from '../../type/table';
import { RenderImage } from '../RenderImage';
import { RenderText } from '../RenderText';
import { RenderVideo } from '../RenderVideo';
import styles from './index.module.scss';
import { CommonParamValueType } from '@common/type/result';

export interface RenderCellProps {
  cell: PreviewTableCellValueType;
  defaultText?: string;
  hoverPlay?: boolean;
  autoPlay?: boolean;
}

const OrderList: CommonParamValueType[] = [
  'image',
  'video',
  'string',
  'number',
];

export const RenderCell: React.FC<RenderCellProps> = ({
  cell,
  defaultText = '-',
  hoverPlay = false,
  autoPlay = false,
}) => {
  const Content = useMemo(() => {
    const RenderComponentMap: Record<
      CommonParamValueType,
      FunctionComponent<{
        value: AtomValueType;
        isOnlyText?: boolean;
        hoverPlay?: boolean;
        autoPlay?: boolean;
      }>
    > = {
      image: RenderImage,
      video: RenderVideo,
      string: RenderText,
      number: RenderText,
    };
    if (cell && cell.length > 0) {
      const isOnlyText =
        cell.every((c) => ['string', 'number'].includes(c.type)) &&
        cell.length === 1;
      return OrderList.map((o) => {
        const v = cell.filter((v) => v.type === o);
        if (v.length) {
          return v.map((item) => {
            const Comp = RenderComponentMap[o];
            return (
              <Comp
                key={o}
                value={item}
                isOnlyText={isOnlyText}
                hoverPlay={hoverPlay}
                autoPlay={autoPlay}
              />
            );
          });
        } else {
          return null;
        }
      });
    } else {
      return (
        <RenderText
          value={
            {
              label: '',
              type: 'string',
              value: [defaultText],
            } as AtomValueType
          }
        />
      );
    }
  }, [cell, defaultText]);
  return <div className={styles.container}>{Content}</div>;
};
