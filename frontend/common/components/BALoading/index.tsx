// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import classNames from 'classnames';

import { ReactComponent as LoadingIcon } from '@static/icons/ba-loading-icon.svg';

import style from './index.module.scss';

export const BALoading = ({
  styles,
  className,
}: {
  styles?: React.CSSProperties;
  className?: string;
}) => (
  <div className={classNames(style.loadingContainer, className)} style={styles}>
    <LoadingIcon className={style.loading} />
  </div>
);

export default BALoading;
