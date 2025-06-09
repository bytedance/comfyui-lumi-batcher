// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { Button, type ButtonProps } from '@arco-design/web-react';
import { IconArrowLeft } from '@arco-design/web-react/icon';
import cx from 'classnames';

import { ReactComponent as IconClose } from '@static/icons/minimize.svg';

import './index.scss';
import { I18n } from '@common/i18n';
import { useContainerStore } from '@common/state/container';
import { ContainerTypeEnum } from '@common/constant/container';
import { languageUtils, TranslateKeys } from '@common/language';

interface ButtonCloseProps
  extends Omit<ButtonProps, 'type' | 'icon' | 'children' | 'size'> {
  gobackText?: string;
  onGoBack?: () => void;
  /**
   * 弹窗关闭或返回
   * @param type 默认 'close'
   */
  type?: 'close' | 'goback';
}

export default function ButtonClose({
  className,
  type = 'close',
  gobackText = I18n.t('return', {}, '返回'),
  onGoBack,
  ...othersProps
}: ButtonCloseProps) {
  const { changeType, closeModal } = useContainerStore();

  const { icon, text, onClick } = useMemo(() => {
    switch (type) {
      case 'goback':
        return {
          icon: <IconArrowLeft style={{ fontSize: 16 }} />,
          text: gobackText,
          onClick: () => {
            if (onGoBack) {
              onGoBack();
            } else {
              changeType(ContainerTypeEnum.List);
            }
          },
        };
      default:
        return {
          icon: <IconClose />,
          text: languageUtils.getText(TranslateKeys.WINDOW_MINIMIZE),
          onClick: () => {
            closeModal && closeModal();
          },
        };
    }
  }, [type]);

  return (
    <Button
      {...othersProps}
      className={cx('batch-tools-modal-button-close', className)}
      type="default"
      size="small"
      icon={icon}
      onClick={onClick}
    >
      {text}
    </Button>
  );
}
