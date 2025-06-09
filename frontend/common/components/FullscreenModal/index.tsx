// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Modal } from '@arco-design/web-react';

import styles from './index.module.scss';

export const openFullScreenModal = (content?: React.ReactNode) => {
  const { close } = Modal.confirm({
    title: null,
    wrapClassName: styles.fullscreenWrap,
    icon: null,
    footer: null,
    className: styles.fullscreenModal,
    content: <div className={styles.fullscreenContent}>{content}</div>,
    alignCenter: true,
    focusLock: false,
    closable: true,
    escToExit: false,
    maskClosable: false,
    closeIcon: null,
    mask: false,
  });

  return () => {
    close();
  };
};
