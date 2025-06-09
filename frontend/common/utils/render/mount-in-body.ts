// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type CSSProperties, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { isString } from 'lodash';
import { makeStyleToCSSText } from '@common/utils/style-to-text';

const rootDomStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 9999,
};
export type MountInBodyReturn = {
  unmount: () => void;
};
export const mountInBody = (
  component: ReactNode,
  containerStyle?: CSSProperties | string,
): MountInBodyReturn => {
  const container = document.createElement('div');
  if (isString(containerStyle)) {
    container.classList.add(containerStyle);
  } else {
    container.style.cssText = makeStyleToCSSText(
      Object.assign({}, rootDomStyle, containerStyle ?? {}),
    );
  }
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(component);
  return {
    unmount: () => {
      root.unmount();
      container.remove();
    },
  };
};
