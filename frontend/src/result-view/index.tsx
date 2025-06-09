// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo } from 'react';

import { Drawer, Spin } from '@arco-design/web-react';
import { isNil, isNumber } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { getRoomResults } from '@api/result';
import { ReactComponent as IconQuestion } from '@static/icons/question.svg';

import Header from './components/header';
import { ResultPreviewTable } from './components/result-preview-table';
import styles from './index.module.scss';
import { useResultViewStore } from './store';
import { getDefaultConfigOptionIndex } from './util';
import useResize from '@common/hooks/use-resize';
import { processResourceUrl } from '@common/utils/process-resource';
import Flex from '@common/components/Flex';
import { I18n } from '@common/i18n';
import { deleteSearchParams } from '@common/utils/url-help';
import { ReactComponent as SpinIcon } from '@static/icons/result-view/loading.svg';

export default function TaskResultView() {
  const height = useResize(() => window.innerHeight - 60 - 24);
  const loading = useResultViewStore(useShallow((s) => s.loading));

  const { setState } = useResultViewStore;
  const [taskId, detail, tableConfigOptions, selectedConfigOptionIndex] =
    useResultViewStore(
      useShallow((s) => [
        s.taskId,
        s.detail,
        s.tableConfigOptions,
        s.selectedConfigOptionIndex,
      ]),
    );

  useEffect(() => {
    (async () => {
      setState({
        loading: true,
      });
      try {
        const detail = await getRoomResults(taskId);
        // 处理映射的资源;
        Object.keys(detail?.resourcesMap || {}).forEach((key) => {
          detail.resourcesMap[key] = processResourceUrl(
            detail.resourcesMap[key],
          );
        });
        setState((state) => ({
          detail,
          selectedConfigOptionIndex:
            isNumber(selectedConfigOptionIndex) &&
            selectedConfigOptionIndex >= 0 &&
            selectedConfigOptionIndex < tableConfigOptions.length
              ? state.selectedConfigOptionIndex
              : getDefaultConfigOptionIndex(tableConfigOptions),
        }));
      } finally {
        setState({
          loading: false,
        });
      }
    })();
  }, [taskId]);

  const Content = useMemo(
    () =>
      detail && isNil(detail.results) ? (
        <Flex
          className={styles.empty}
          direction="column"
          justify="center"
          align="center"
        >
          <IconQuestion className={styles.emptyIcon} />
          <div className={styles.emptyText}>
            {I18n.t('no_results_generated', {}, '无生成结果')}
          </div>
        </Flex>
      ) : (
        <ResultPreviewTable />
      ),
    [detail],
  );

  return (
    <Flex className={styles.container} style={{ height }} direction="column">
      <Header />
      {loading ? (
        <Spin
          className={styles.spinContainer}
          tip={I18n.t(
            'data_is_being_prepared__please_wait___',
            {},
            '正在准备数据，请稍后...',
          )}
          icon={<SpinIcon className={styles.spinIcon} />}
        />
      ) : (
        Content
      )}
    </Flex>
  );
}

export const TaskResultDrawer = () => {
  const [visible] = useResultViewStore(useShallow((s) => [s.visible]));

  return (
    <Drawer
      width="100vw"
      height="calc(100vh - 60px)"
      title={null}
      footer={null}
      visible={visible}
      placement="bottom"
      onOk={() => {
        useResultViewStore.setState({
          visible: false,
        });
      }}
      className={styles.drawerContainer}
      onCancel={() => {
        useResultViewStore.setState({
          visible: false,
        });
        deleteSearchParams(['shareId']);
      }}
      mountOnEnter={true}
      unmountOnExit={true}
      autoFocus={false}
    >
      <TaskResultView />
    </Drawer>
  );
};
