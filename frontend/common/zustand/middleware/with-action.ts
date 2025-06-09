// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type StoreApi, type UseBoundStore } from 'zustand';

type AnyFunction = (...args: any[]) => any;
type AnyObject = Record<string, any>;

type PickFn<T> = {
  [K in keyof T as T[K] extends AnyFunction ? K : never]: T[K];
};

type WithActionStore<S> = S extends { getState: () => infer T }
  ? S & {
      action: PickFn<T>;
    }
  : never;

/**
 * 向 zustand 添加 useXXXX.action.xxx 的方法调用
 *
 */
export const withAction = <T extends UseBoundStore<StoreApi<AnyObject>>>(
  _store: T,
) => {
  const store = _store as WithActionStore<T>;
  const state = store.getState();
  const action: Record<string, AnyFunction> = {};
  for (const key of Object.keys(state)) {
    const value = state[key];
    if (typeof value === 'function') {
      action[key] = value;
    }
  }
  store.action = action;
  return store;
};
