// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import TaskList from '../task-list';
import styles from './index.module.scss';
import { useBatchToolsStore } from '@src/batch-tools/state';
import { I18n } from '@common/i18n';
import Tags from '@common/components/Tags';

export enum CategoryTypeEnum {
  ComfyUI = 'comfyui',
}

const ComponentMap: Record<CategoryTypeEnum, ReactNode> = {
  [CategoryTypeEnum.ComfyUI]: <TaskList />,
};

export const TaskListV2 = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryTypeEnum>(
    CategoryTypeEnum.ComfyUI,
  );
  const uiConfig = useBatchToolsStore((s) => s.uiConfig);

  useEffect(() => {
    const url = new URL(location.href);
    const category = url.searchParams.get('category');
    if (category) {
      setActiveCategory(category as CategoryTypeEnum);
    }
  }, []);

  const CurrentContent = useMemo(
    () => ComponentMap[activeCategory],
    [activeCategory],
  );

  const tagList = useMemo(
    () => [
      {
        id: CategoryTypeEnum.ComfyUI,
        name: I18n.t('batch_task', {}, '批量任务'),
        is_all: false,
        selected: activeCategory === CategoryTypeEnum.ComfyUI,
      },
    ],
    [activeCategory],
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.tagContainer}
        style={{ paddingLeft: uiConfig.listPaddingHorizontal }}
      >
        <Tags
          is_multi={false}
          list={tagList}
          onClick={(select_list) => {
            const key = select_list[0]?.id;
            key && setActiveCategory(key as CategoryTypeEnum);
          }}
        />
      </div>
      {CurrentContent}
    </div>
  );
};
