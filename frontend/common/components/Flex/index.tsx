// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type CSSProperties } from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  style?: CSSProperties;
  flex?: CSSProperties['flex'];
  direction?: CSSProperties['flexDirection'];
  wrap?: boolean | CSSProperties['flexWrap'];
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  gap?: number;
  children: React.ReactNode;
}

export default function Flex({
  style,
  direction,
  wrap,
  justify,
  align,
  flex,
  gap,
  ...othersProps
}: FlexProps) {
  const mergedStyle: CSSProperties = {
    ...style,
    display: 'flex',
    flex,
    flexDirection: direction,
    // eslint-disable-next-line no-nested-ternary
    flexWrap: typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap,
    justifyContent: justify,
    alignItems: align,
    gap,
  };

  return <div {...othersProps} style={mergedStyle} />;
}
