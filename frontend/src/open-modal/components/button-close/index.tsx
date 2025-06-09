// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, type ButtonProps } from '@arco-design/web-react';
import cx from 'classnames';

import { ReactComponent as IconClose } from '@static/icons/minimize.svg';

import './index.scss';
import { useContainerStore } from '@common/state/container';
import { languageUtils, TranslateKeys } from '@common/language';
import { sendBatchToolsWindowMinimize } from '../../../../data/points';

type ButtonCloseProps = Omit<
  ButtonProps,
  'type' | 'icon' | 'children' | 'size' | 'onClick'
>;

export default function ButtonClose({
  className,
  ...othersProps
}: ButtonCloseProps) {
  const closeModal = useContainerStore((s) => s.closeModal);

  return (
    <Button
      {...othersProps}
      className={cx('batch-tools-modal-button-close', className)}
      type="default"
      size="small"
      icon={<IconClose />}
      onClick={() => {
        sendBatchToolsWindowMinimize();
        closeModal && closeModal();
      }}
    >
      {languageUtils.getText(TranslateKeys.WINDOW_MINIMIZE)}
    </Button>
  );
}
