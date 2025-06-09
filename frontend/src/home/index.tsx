// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect } from 'react';
import { DragButton } from './components/DragButton';
import { sendBatchToolsEntranceExpose } from '../../data/points';

export const Home = () => {
  useEffect(() => {
    sendBatchToolsEntranceExpose();
  }, []);

  return <DragButton />;
};
