// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { enableMapSet } from 'immer';
import {
  create as zustandCreate,
  type StateCreator,
  type StoreMutatorIdentifier,
} from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { baseMiddleware } from './middleware/base';
import { withAction } from './middleware/with-action';

enableMapSet();

export const create = <
  State,
  Actions,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  initialState: State,
  createFn: StateCreator<
    State,
    [
      ...Mps,
      ['zustand/immer', never],
      ['zustand/subscribeWithSelector', never],
    ],
    Mcs,
    Actions
  >,
) =>
  withAction(
    zustandCreate(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      subscribeWithSelector(immer(baseMiddleware(initialState, createFn))),
    ),
  );
