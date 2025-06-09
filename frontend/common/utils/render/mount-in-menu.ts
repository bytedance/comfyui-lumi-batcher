// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { makeStyleToCSSText } from '@common/utils/style-to-text';
import { type CSSProperties, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

const rootDomStyle: CSSProperties = {
  width: '100%',
  overflow: 'hidden',
  margin: '1px 0',
  borderRadius: '4px',
  minHeight: '24px',
};
export type MountInMenuConfig = {
  containerStyle?: CSSProperties;
} & (
  | {
      mode: 'front' | 'end';
    }
  | {
      mode: 'relative-before' | 'relative-after';
      target: Element | null;
    }
);
export const safeInsertDom = (
  menuDom: Element,
  rootDom: HTMLElement,
  targetDom: ChildNode | null | undefined,
) => {
  if (!targetDom) {
    throw new Error('Failed to get target dom when render component in menu!');
  }
  menuDom.insertBefore(rootDom, targetDom);
};
export const mountInMenu = (children: ReactNode, config: MountInMenuConfig) => {
  const menuDom = document.querySelector('.comfy-menu');
  if (!menuDom) {
    throw new Error('Failed to get menu dom in comfy ui!');
  }
  const rootDom = document.createElement('div');
  rootDom.style.cssText = makeStyleToCSSText(
    Object.assign({}, rootDomStyle, config.containerStyle ?? {}),
  );

  switch (config.mode) {
    case 'front':
      safeInsertDom(
        menuDom,
        rootDom,
        document.querySelector('#comfy-save-button'),
      );
      break;
    case 'end':
      menuDom.appendChild(rootDom);
      break;
    case 'relative-before':
      safeInsertDom(menuDom, rootDom, config.target);
      break;
    case 'relative-after':
      safeInsertDom(menuDom, rootDom, config.target?.nextSibling);
      break;
    default:
      break;
  }
  const root = createRoot(rootDom);
  root.render(children);
  return () => {
    root.unmount();
    rootDom.remove();
  };
};
