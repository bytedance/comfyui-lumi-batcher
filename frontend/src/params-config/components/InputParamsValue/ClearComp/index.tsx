// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import { IconClose } from '@arco-design/web-react/icon';

import './index.scss';

export const ClearComponent: React.FC<{
  onClick: () => void;
}> = ({ onClick }) => <IconClose className="clear-icon" onClick={onClick} />;
