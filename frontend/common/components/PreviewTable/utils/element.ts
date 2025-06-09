// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export function isElementInContainer(el: HTMLElement, parent: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  return (
    rect.top >= parentRect.top &&
    rect.left >= parentRect.left &&
    rect.bottom <= parentRect.bottom &&
    rect.right <= parentRect.right
  );
}
