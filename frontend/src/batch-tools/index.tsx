// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type ReactNode, useEffect } from 'react';

import { Button } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import { useShallow } from 'zustand/react/shallow';

import CreateTask from '../create-task';
import TaskResultView from '../result-view';
import { useBatchToolsStore } from './state';
import Flex from '@common/components/Flex';
import {
  BatchToolsVersion,
  ContainerTypeEnum,
} from '@common/constant/container';
import { languageUtils } from '@common/language';
import { I18n } from '@common/i18n';
import { useContainerStore } from '@common/state/container';
import TaskList from '@src/task-list';

function WrapClose({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column">
      <Flex justify="flex-end" style={{ padding: '10px 32px' }}>
        <Button
          icon={<IconClose />}
          size="large"
          shape="circle"
          onClick={() =>
            useContainerStore.getState().changeType(ContainerTypeEnum.List)
          }
        />
      </Flex>
      {children}
    </Flex>
  );
}

export function BatchTools() {
  // 全局配置
  const [uiConfig, i18n] = useBatchToolsStore(
    useShallow((s) => [s.uiConfig, s.i18n]),
  );
  const [type, isLock] = useContainerStore(
    useShallow((s) => [s.type, s.isLock]),
  );

  const { showVersion } = uiConfig;

  // 初始化更新语言
  useEffect(() => {
    if (i18n) {
      languageUtils.setRuntimeLanguage(i18n);
    }
  }, []);

  const Comp = {
    [ContainerTypeEnum.List]: TaskList,
    [ContainerTypeEnum.Creator]: CreateTask,
    [ContainerTypeEnum.Result]: TaskResultView,
  }[type];

  return (
    <>
      {type === ContainerTypeEnum.Result ? (
        <WrapClose>
          <Comp />
        </WrapClose>
      ) : (
        <Comp />
      )}

      {isLock ? <div className="batch-tools-container-lock" /> : null}
      {showVersion ? (
        <Flex
          style={{
            fontSize: 10,
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 9999,
          }}
          align="center"
        >
          <span>
            {I18n.t(
              'batch_tool_version_number__{batchtoolsversion}',
              { BatchToolsVersion },
              '批量工具版本号: {BatchToolsVersion}',
            )}
          </span>
        </Flex>
      ) : null}
    </>
  );
}
