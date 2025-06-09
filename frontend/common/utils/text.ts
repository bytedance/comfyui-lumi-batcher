// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/** 格式化序号 */
export const formatSerialNumber = (num: number): string => {
  if (String(num).length < 2) {
    return `0${num}`;
  } else {
    return String(num);
  }
};

export function copyTextV1(text: string) {
  return new Promise((resolve) => {
    const textarea = document.createElement('input');
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.focus();
    let flag = true;
    if (textarea.setSelectionRange) {
      textarea.setSelectionRange(0, textarea.value.length);
    } else {
      textarea.select();
    }
    try {
      flag = document.execCommand('copy');
    } catch (eo) {
      flag = false;
    }
    document.body.removeChild(textarea);
    resolve(flag);
  });
}

export async function copyTextV2(text: string) {
  const { clipboard } = navigator;

  if (!clipboard) {
    // 降级成V1版本
    await copyTextV1(text);
  }

  await navigator.clipboard.writeText(text);
}
