// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// 初始化
const fpPromise = FingerprintJS.load();

// 获取指纹ID
export const getFingerprint = async () => {
  const fp = await fpPromise;
  const result = await fp.get();
  console.log('Device ID:', result.visitorId);
  return result;
};
