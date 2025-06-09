// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Space } from '@arco-design/web-react';

import emptyImg from '@static/img/empty-list-img.png';

import styles from './index.module.scss';
import { I18n } from '@common/i18n';

export const ContentEmpty = () => (
  <Space direction="vertical" size="large" className={styles.container}>
    <img className={styles.emptyImg} src={emptyImg} alt="" />
    <p className={styles.text}>{I18n.t('no_content_yet', {}, '暂无内容')}</p>
  </Space>
);
