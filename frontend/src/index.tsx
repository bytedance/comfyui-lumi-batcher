// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later

import '@arco-design/web-react/dist/css/arco.css';
import { registerBatchToolsV2Btn } from './batch-tools/utils';

import '@arco-design/theme-babeta/index.less';
import '@common/styles/index.scss';

export const registerBatchInTheRoom = () => {
  registerBatchToolsV2Btn();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/api/comfyui-lumi-batcher/sw.js')
      .then(function (registration) {
        console.log(
          'Service Worker registered with scope:',
          registration.scope,
        );
      })
      .catch(function (error) {
        console.error('Service Worker registration failed:', error);
      });
  }
};

registerBatchInTheRoom();
