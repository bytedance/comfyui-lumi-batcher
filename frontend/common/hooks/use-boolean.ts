// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo, useState } from 'react';

export default function useBoolean(initBool = false): [
  boolean,
  {
    toggle: (newBool: boolean) => void;
    setTrue: () => void;
    setFalse: () => void;
  },
] {
  const [state, setState] = useState(initBool);

  return [
    state,
    useMemo(
      () => ({
        toggle: (newBool: boolean) => setState(newBool),
        setTrue: () => setState(true),
        setFalse: () => setState(false),
      }),
      [],
    ),
  ];
}
