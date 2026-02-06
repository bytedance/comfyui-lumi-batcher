// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginTypedCSSModules } from '@rsbuild/plugin-typed-css-modules';
import { pluginLess } from '@rsbuild/plugin-less';
const path = require('path');

// Use direct extension path instead of API endpoint
const extensionBasePath = "/extensions/comfyui-lumi-batcher";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        exportType: 'named',
      },
    }),
    pluginSass(),
    pluginLess(),
    pluginTypedCSSModules(),
  ],
  output: {
    cssModules: {
      exportLocalsConvention: 'camelCaseOnly',
      // exportGlobals: true,
    },
    sourceMap: {
      js: 'cheap-module-source-map',
      css: true,
    },
    assetPrefix: `${extensionBasePath}`,
  },
  resolve: {
    alias: {
      '@common': path.resolve(__dirname, 'common'),
    },
  },
});
