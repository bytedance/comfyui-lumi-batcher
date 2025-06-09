// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import { ReactComponent as DisplayIcon } from '@static/icons/resource-output-failed.svg';

import style from './index.module.scss';

export const ResourceOutputError = ({
  styles,
}: {
  styles?: React.CSSProperties;
}) => (
  <div className={style.Container} style={styles}>
    <DisplayIcon className={style.loading} />
  </div>
);

export default ResourceOutputError;
