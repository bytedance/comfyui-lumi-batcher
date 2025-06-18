// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, Dropdown, Menu, Space } from '@arco-design/web-react';
import { IconCheck } from '@arco-design/web-react/icon';

import { ReactComponent as LanguageIcon } from '@static/icons/language.svg';
import { ReactComponent as LanguageEnIcon } from '@static/icons/en-icon.svg';
import { ReactComponent as LanguageZhIcon } from '@static/icons/zh-icon.svg';
import cn from 'classnames';

import './index.scss';
import {
  languageDisplayText,
  LanguagesEnum,
  languageUtils,
} from '@common/language';
import { useContainerStore } from '@common/state/container';

const list = [
  {
    key: LanguagesEnum.ZH,
    label: '简体中文',
    icon: LanguageZhIcon,
  },
  {
    key: LanguagesEnum.EN,
    label: 'English',
    icon: LanguageEnIcon,
  },
];

export const LanguageChoose = () => {
  const language = useContainerStore((s) => s.language);

  return (
    <Dropdown
      position="br"
      droplist={
        <Menu
          selectedKeys={[language]}
          onClickMenuItem={(v) => {
            languageUtils.setLanguage(v as LanguagesEnum);
            window.location.reload();
          }}
        >
          {list.map((item) => {
            return (
              <Menu.Item key={item.key} className="language-menu-item">
                <Space
                  size={8}
                  className={cn(
                    'language-menu-item-content',
                    language === item.key
                      ? 'language-trigger-button-active'
                      : '',
                  )}
                >
                  <item.icon />
                  <span style={{ marginRight: 30 }}>{item.label}</span>
                  {language === item.key ? (
                    <IconCheck
                      style={{
                        color:
                          'var(--text-color-text-1, rgba(255, 255, 255, 0.85))',
                      }}
                    />
                  ) : (
                    <div style={{ width: 16 }} />
                  )}
                </Space>
              </Menu.Item>
            );
          })}
        </Menu>
      }
    >
      <Button
        className="language-trigger-button"
        type="default"
        size="small"
        icon={<LanguageIcon />}
      >
        {languageDisplayText[language]}
      </Button>
    </Dropdown>
  );
};
