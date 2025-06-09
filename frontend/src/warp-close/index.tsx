// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type ReactNode } from 'react';

import { Button } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import Flex from '@common/components/Flex';

import './index.scss';
export function WrapClose({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <Flex direction="column" className="inherit-all-space">
      <Flex justify="flex-end" style={{ padding: '10px 24px' }}>
        <Button
          icon={<IconClose />}
          style={{
            width: 40,
            height: 40,
          }}
          shape="circle"
          onClick={() => onClose && onClose()}
        />
      </Flex>
      <Flex flex={1}>{children}</Flex>
    </Flex>
  );
}
