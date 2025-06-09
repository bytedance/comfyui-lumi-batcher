// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
export const checkDomByCb = (
  dom: Element | null,
  cb: (ele: Element) => void,
) => {
  if (dom) {
    cb(dom);
  } else {
    window.requestAnimationFrame(() => checkDomByCb(dom, cb));
  }
};
