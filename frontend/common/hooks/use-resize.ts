// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from 'react';

export default function useResize<T>(resize: () => T) {
  const [size, setSize] = useState(resize);

  useEffect(() => {
    const onResize = () => {
      setSize(resize());
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return size;
}
