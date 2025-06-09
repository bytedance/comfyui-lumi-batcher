// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, Input, Space } from '@arco-design/web-react';
import { IconSearch } from '@arco-design/web-react/icon';
import cx from 'classnames';
import { debounce } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { useTaskListStore } from '../../store';
import { CreateTaskButton } from '../create-task-button';
import type { TableHeaderProps } from './interface';

import './index.scss';
import { useBatchToolsStore } from '@src/batch-tools/state';
import Flex from '@common/components/Flex';
import { languageUtils, TranslateKeys } from '@common/language';
import { newGuideHelpLink } from '@common/constant/creator';

const debounceTime = 500;

export default function TableHeader({ className }: TableHeaderProps) {
  const [uiConfig, task] = useBatchToolsStore(
    useShallow((s) => [s.uiConfig, s.task]),
  );
  const [taskName] = useTaskListStore(useShallow((s) => [s.taskName]));

  const onTaskNameChange = debounce((newName: string) => {
    useTaskListStore.setState({
      taskName: newName,
      currentPage: 1,
    });
  }, debounceTime);

  return (
    <Flex
      className={cx('table-header', className)}
      justify="space-between"
      align="center"
    >
      <span className="table-header-title">
        {uiConfig.showTitle
          ? languageUtils.getText(TranslateKeys.TASK_LIST_TITLE)
          : null}
      </span>

      <Space size={8}>
        <Input
          className="table-header-name-input"
          placeholder={languageUtils.getText(
            TranslateKeys.TASK_LIST_SEARCH_PLACEHOLDER,
          )}
          suffix={<IconSearch />}
          defaultValue={taskName}
          onChange={onTaskNameChange}
          allowClear
        />
        <Button
          type="secondary"
          size="default"
          style={{
            height: 36,
          }}
          onClick={() => window.open(task.newGuideHelpLink || newGuideHelpLink)}
        >
          {languageUtils.getText(TranslateKeys.NEW_GUIDER_HELP)}
        </Button>
        <CreateTaskButton />
      </Space>
    </Flex>
  );
}
