// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type FunctionComponent } from 'react';

import { Typography } from '@arco-design/web-react';

import {
  type AtomValueType,
  type PreviewTableCellValueType,
} from '../../type/table';
import BlobVideo from '../BlobVideo';
import { LoadImg } from '../LoadImg';
import styles from './index.module.scss';
import { CommonParamValueType } from '@common/type/result';

const OrderList: CommonParamValueType[] = [
  'image',
  'video',
  'string',
  'number',
];

const RenderText: React.FC<{
  value: string;
  showTooltip?: boolean;
}> = ({ value, showTooltip = false }) => (
  <Typography.Ellipsis
    className={styles.renderText}
    rows={1}
    showTooltip={
      showTooltip
        ? {
            getPopupContainer: () => document.body,
          }
        : false
    }
  >
    {value}
  </Typography.Ellipsis>
);

const RenderImage: React.FC<{
  value: string;
}> = ({ value }) => (
  <div className={styles.renderImage}>
    <LoadImg
      src={value}
      style={{
        borderRadius: 4,
      }}
    />
  </div>
);

const RenderVideo: React.FC<{
  value: string;
}> = ({ value }) => (
  <div className={styles.renderVideo}>
    <BlobVideo
      style={{
        width: 22,
        height: 22,
        objectFit: 'contain',
        background: 'var(--color-fill-1, rgba(0, 0, 0, 0.12))',
        borderRadius: 4,
      }}
      hoverPlay
      src={value}
      controls={false}
    />
  </div>
);

export const RenderValue: React.FC<{
  value: PreviewTableCellValueType;
  showTooltip?: boolean;
}> = ({ value, showTooltip = false }) => {
  const RenderComponentMap: Record<
    CommonParamValueType,
    FunctionComponent<{
      value: string;
      showTooltip?: boolean;
    }>
  > = {
    image: RenderImage,
    video: RenderVideo,
    string: RenderText,
    number: RenderText,
  };
  if (value.length > 0) {
    const compList: any[] = [];
    const textValueList: AtomValueType[] = [];
    OrderList.forEach((o) => {
      const v = value.filter((v) => v.type === o);
      if (v.length) {
        v.forEach((item) => {
          const Comp = RenderComponentMap[o];
          if (o === 'string' || o === 'number') {
            textValueList.push(item);
          } else {
            item.value.forEach((v, i) => {
              compList.push(<Comp key={i} value={v} />);
            });
          }
        });
      }
    });
    if (textValueList.length > 0) {
      // 文本场景需要处理拼接
      const v = textValueList
        .map((item) => {
          let s = '';
          const { label, value } = item;
          if (label) {
            s += `${label}: ${value}`;
          } else {
            s += `${value}`;
          }

          return s;
        })
        .join('+');
      compList.push(<RenderText value={v} showTooltip={showTooltip} />);
    }
    return compList as any;
  } else {
    return <RenderText value="-" />;
  }
};
