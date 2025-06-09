// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Tabs } from '@arco-design/web-react';

import styles from './index.module.scss';
import { I18n } from '@common/i18n';

export interface TabsConfig {
  key: string;
  label: string;
  index?: number;
}

interface ToolsTabsProps {
  currentTab: TabsConfig;
  expandTabList?: TabsConfig[];
  onTabChange: (value: TabsConfig) => void;
}

export enum TabsKeyEnum {
  ComfyUI = 'comfy_ui',
}

export const DefaultTabsSelect: TabsConfig = {
  label: I18n.t('comfyui_batch_generation', {}, 'ComfyUI批量生成'),
  key: TabsKeyEnum.ComfyUI,
  index: 0,
};

export const TabsLabelMap = {
  [TabsKeyEnum.ComfyUI]: I18n.t(
    'comfyui_batch_generation',
    {},
    'ComfyUI批量生成',
  ),
};

export const DefaultTabConfigList: TabsConfig[] = [
  {
    label: I18n.t('comfyui_batch_generation', {}, 'ComfyUI批量生成'),
    key: TabsKeyEnum.ComfyUI,
    index: 0,
  },
];

export const ToolsTabsV2: React.FC<ToolsTabsProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TabsConfig>(DefaultTabsSelect);

  const { currentTab, expandTabList = [], onTabChange } = props;

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const currentTabConfigList = useMemo(
    () =>
      DefaultTabConfigList.concat(expandTabList).sort(
        (a, b) => Number(a.index) - Number(b.index),
      ),
    [expandTabList],
  );

  return (
    <Tabs
      activeTab={activeTab.key}
      onClickTab={(key) => {
        const c = currentTabConfigList.find(
          (tabConfig) => tabConfig.key === key,
        );
        c && onTabChange(c);
      }}
      className={styles.tabs}
    >
      {currentTabConfigList.map((item) => (
        <Tabs.TabPane key={item.key} title={item.label} />
      ))}
    </Tabs>
  );
};
