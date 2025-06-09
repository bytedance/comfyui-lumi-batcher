// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Layout, Modal } from '@arco-design/web-react';
import Content from '@arco-design/web-react/es/Layout/content';
import Header from '@arco-design/web-react/es/Layout/header';

import { useCreatorStore } from '../create-task/store';
import { ParamsConfigContent } from './components/Content';
import { ParamsConfigHeader } from './components/Header';

import './index.scss';

export const ParamsConfigContainer = () => (
  <Layout style={{ height: '100%' }}>
    <Header>
      <ParamsConfigHeader />
    </Header>
    <Content>
      <ParamsConfigContent />
    </Content>
  </Layout>
);

export const openParamsConfigModal = () => {
  const { close } = Modal.confirm({
    title: <div />,
    wrapClassName: 'params-config-modal-wrap',
    icon: null,
    footer: null,
    className: 'params-config-modal',
    content: <ParamsConfigContainer />,
    alignCenter: true,
    focusLock: false,
    closable: true,
    escToExit: false,
    maskClosable: false,
  });

  useCreatorStore.setState({
    closeParamsModal: close,
  });
};
