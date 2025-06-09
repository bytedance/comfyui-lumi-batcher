// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import { Spin } from '@arco-design/web-react';

import emptyImg from '@static/img/empty-list-img.png';

import styles from './index.module.scss';
import { I18n } from '@common/i18n';

export interface EmptyListProps {
  text?: string;
  loading?: boolean;
  style?: React.CSSProperties;
  extra?: React.ReactNode;
}

export const EmptyList: React.FC<EmptyListProps> = ({
  text = I18n.t('no_data_yet', {}, '暂无数据'),
  loading = false,
  style = {},
  extra = null,
}) => (
  <div className={styles.container} style={style}>
    {loading ? (
      <div className={styles.loading}>
        <Spin />
        <span className={styles.loadingText}>
          {I18n.t('loading_please_wait~', {}, '加载中，请稍后～')}
        </span>
      </div>
    ) : (
      <>
        <img className={styles.emptyImg} src={emptyImg} alt="" />
        <span className={styles.emptyText}>{text}</span>
      </>
    )}
    {extra}
  </div>
);
