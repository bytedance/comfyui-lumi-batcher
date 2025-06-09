// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Modal } from '@arco-design/web-react';

import './index.scss';
import { useContainerStore } from '@common/state/container';
import { useBatchToolsStore } from '@src/batch-tools/state';
import ModalHeader from './components/header';
import { BatchTools } from '@src/batch-tools';
import { languageUtils } from '@common/language';
import { sendBatchToolsOpenModal } from '../../data/points';

function Container() {
  return (
    <>
      <ModalHeader />
      <div className="batch-tools-container">
        <div className="batch-tools-render-content">
          <BatchTools />
        </div>
      </div>
    </>
  );
}

export const openModal = () => {
  // 关闭鼠标右键菜单
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window?.LiteGraph?.closeAllContextMenus();

  sendBatchToolsOpenModal();

  const { close } = Modal.confirm({
    title: null,
    wrapClassName: 'batch-tools-container-modal-wrap',
    icon: null,
    footer: null,
    className: 'batch-tools-container-modal',
    content: <Container />,
    alignCenter: true,
    focusLock: false,
    closable: true,
    escToExit: false,
    maskClosable: false,
    closeIcon: null,
  });

  useBatchToolsStore.setState({
    i18n: languageUtils.getLanguage(),
    uiConfig: {
      showVersion: true,
      showTitle: false,
      showCreateTask: true,
      showCopy: true,
      showCancel: true,
      listPaddingHorizontal: 24,
    },
    containerRect: {
      clientHeight: 0,
      clientWidth: 0,
    },
  });

  useContainerStore.setState({
    closeModal: () => {
      close();
    },
  });
};
