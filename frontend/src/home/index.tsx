// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect } from 'react';
import { DragButton } from './components/DragButton';
import { sendBatchToolsEntranceExpose } from '../../data/points';
import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import zhCN from '@arco-design/web-react/es/locale/zh-CN';
import { LanguagesEnum, languageUtils } from '@common/language';

export const Home = () => {
  useEffect(() => {
    sendBatchToolsEntranceExpose();
  }, []);

  return (
    <ConfigProvider
      locale={languageUtils.getLanguage() === LanguagesEnum.EN ? enUS : zhCN}
    >
      <DragButton />
    </ConfigProvider>
  );
};
