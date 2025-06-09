// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, Layout, Space } from '@arco-design/web-react';
import Content from '@arco-design/web-react/es/Layout/content';
import Header from '@arco-design/web-react/es/Layout/header';
import { IconLeft } from '@arco-design/web-react/icon';
import cn from 'classnames';

import { ReactComponent as LinkIcon } from '@static/icons/link.svg';

import styles from './index.module.scss';
import { newGuideHelpLink } from '@common/constant/creator';
import { languageUtils, TranslateKeys } from '@common/language';
import { I18n } from '@common/i18n';

interface LayoutProps {
  title: string;
  hideGuide?: boolean;
  content: React.ReactNode;
  backContent?: React.ReactNode;
  onBack?: () => void;
  style?: React.CSSProperties;
  guideLink?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const LayoutV2: React.FC<LayoutProps> = ({
  title,
  hideGuide = false,
  backContent,
  content,
  style,
  onBack,
  guideLink = newGuideHelpLink,
  headerClassName = '',
  contentClassName = '',
}) => (
  <Layout className={cn(styles.container)} style={style}>
    <Header className={cn(styles.header, headerClassName)}>
      <div
        onClick={() => {
          onBack && onBack();
        }}
      >
        {backContent ? (
          backContent
        ) : (
          <Space className={styles.headerLeft}>
            <IconLeft />
            <p className={styles.headerText}>{I18n.t('return', {}, '返回')}</p>
          </Space>
        )}
      </div>
      <p className={styles.headerTitle}>{title}</p>
      {!hideGuide ? (
        <Space>
          <Button
            href={guideLink}
            target="_blank"
            type="secondary"
            size="default"
            icon={<LinkIcon />}
            style={{
              backgroundColor: 'var(--color-fill-2)',
              height: 36,
            }}
          >
            {languageUtils.getText(TranslateKeys.NEW_GUIDER_HELP)}
          </Button>
        </Space>
      ) : null}
    </Header>
    <Content className={cn(contentClassName)}>{content}</Content>
  </Layout>
);

export default LayoutV2;
