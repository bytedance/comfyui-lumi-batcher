// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type { ReactNode } from 'react';

import {
  Button,
  type ButtonProps,
  Tooltip,
  type TooltipProps,
} from '@arco-design/web-react';

interface IconButtonTooltipProps
  extends Omit<ButtonProps, 'shape' | 'children' | 'icon'> {
  icon: ReactNode;
  tooltip?: Omit<TooltipProps, 'children'> | string;
}

export default function IconButtonTooltip({
  tooltip,
  ...othersProps
}: IconButtonTooltipProps) {
  const btn = <Button shape="circle" {...othersProps} />;

  if (!tooltip) {
    return btn;
  }

  const tooltipProps =
    typeof tooltip === 'string' ? { content: tooltip } : tooltip;

  return (
    <Tooltip {...tooltipProps} getPopupContainer={() => document.body}>
      {btn}
    </Tooltip>
  );
}
