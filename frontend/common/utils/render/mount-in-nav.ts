// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { makeStyleToCSSText } from '@common/utils/style-to-text';
import { CSSProperties, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { MountInMenuConfig, safeInsertDom } from './mount-in-menu';

const rootDomStyle: CSSProperties = {
  width: '100%',
  overflow: 'hidden',
  margin: '1px 0',
  borderRadius: '4px',
  minHeight: '24px',
};

export const mountInNav = async (
  children: ReactNode,
  config: MountInMenuConfig,
) => {
  const menuDom = document.getElementById('comfyui-body-left');
  console.log('menuDom', menuDom);

  //TODO：递归轮询
  await new Promise((resolve) => {
    const interval = setTimeout(() => {
      clearTimeout(interval);
      resolve(menuDom);
    }, 1000);
  });

  const firstNav = menuDom ? menuDom.querySelector('nav') : null;
  console.log('firstNav', firstNav);
  const firstChild = firstNav ? firstNav.firstElementChild : null;
  console.log('firstChild', firstChild);
  // 获取最后一个button子元素
  const buttons = firstNav ? firstNav.querySelectorAll('button') : null;
  const lastButton =
    buttons && buttons.length > 0 ? buttons[buttons.length - 1] : null;

  if (!menuDom || !firstNav || !firstChild) {
    throw new Error('Failed to get dom in comfy ui!');
  }
  const rootDom = document.createElement('div');
  rootDom.style.cssText = makeStyleToCSSText(
    Object.assign({}, rootDomStyle, config.containerStyle ?? {}),
  );

  switch (config.mode) {
    case 'front':
      safeInsertDom(firstNav, rootDom, firstChild);
      break;
    case 'end':
      safeInsertDom(firstNav, rootDom, lastButton);
      break;
    case 'relative-before':
      safeInsertDom(firstNav, rootDom, config.target);
      break;
    case 'relative-after':
      safeInsertDom(firstNav, rootDom, config.target?.nextSibling);
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
