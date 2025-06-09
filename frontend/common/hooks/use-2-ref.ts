// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useRef } from 'react';

export default function use2Ref<T>(args: T) {
  const ref = useRef(args);
  ref.current = args;
  return ref;
}
