// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { create } from 'zustand';

import { type LanguagesEnum, languageUtils } from '../language';
import { ContainerTypeEnum } from '@common/constant/container';
import { useBatchToolsStore } from '@src/batch-tools/state';

export interface ContainerStateType {
  type: ContainerTypeEnum;
  /** 全屏锁（比如复制参数需要使禁止所有操作 2s） */
  isLock: boolean;
  language: LanguagesEnum;
  reset: () => void;
  lock: () => void;
  unlock: () => void;
  closeModal?: () => void;
  changeType: (type: ContainerTypeEnum) => void;
}

const defaultStore: Omit<
  ContainerStateType,
  'reset' | 'lock' | 'unlock' | 'changeType'
> = {
  type: ContainerTypeEnum.List,
  isLock: false,
  language: languageUtils.getLanguage(),
};

export const useContainerStore = create<ContainerStateType>((set) => ({
  ...defaultStore,
  lock() {
    set({ isLock: true });
  },
  unlock() {
    set({ isLock: false });
  },
  changeType(type: ContainerTypeEnum) {
    const cb = useBatchToolsStore.getState().onCompStatusChange;
    if (cb) {
      cb(type);
    }
    set({ type });
  },
  reset() {
    set(defaultStore);
  },
}));
