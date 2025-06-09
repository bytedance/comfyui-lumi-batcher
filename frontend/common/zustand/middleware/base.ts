// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * 基础的中间件，目前提供以下几个能力
 * 1. 提供实例的 reset 方法， useXXX.getState().reset()
 * 2. 新的构造器，可以直接字面量进行 ts 类型推导
 */
import { type StateCreator, type StoreMutatorIdentifier } from 'zustand';

type Write<T, U> = Omit<T, keyof U> & U;

export interface ExtraState {
  /** 恢复至初始状态 */
  reset: () => void;
}

type BaseMiddleware = <
  State,
  Actions,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initialState: State,
  create: StateCreator<State, Mps, Mcs, Actions>,
) => StateCreator<Write<State & ExtraState, Actions>, Mps, Mcs>;

export const baseMiddleware: BaseMiddleware =
  (initialState, create) => (set, get, api) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _initialState = initialState;
    return {
      reset() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        set(_initialState);
      },
      ...initialState,
      ...(create as any)(set, get, api),
    };
  };
