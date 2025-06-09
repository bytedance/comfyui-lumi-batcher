// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import { ReactComponent as DisplayIcon } from '@static/icons/resource-load-error.svg';

import s from './index.module.scss';

export const ResourceLoadError = ({
  styles,
}: {
  styles?: React.CSSProperties;
}) => (
  <div className={s.container} style={styles}>
    <DisplayIcon className={s.error} />
  </div>
);

export default ResourceLoadError;
