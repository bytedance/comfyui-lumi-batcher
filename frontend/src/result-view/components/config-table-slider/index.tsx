// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { Slider } from '@arco-design/web-react';
import { throttle } from 'lodash';
import { useShallow } from 'zustand/react/shallow';

import { ReactComponent as IconGridBig } from '@static/icons/grid-big.svg';
import { ReactComponent as IconGridSmall } from '@static/icons/grid-small.svg';

import { useResultViewStore } from '../../store';
import styles from './index.module.scss';
import Flex from '@common/components/Flex';

export default function ConfigTableSlider() {
  const [previewPercent] = useResultViewStore(
    useShallow((s) => [s.previewPercent]),
  );

  const onPreviewPercentUpdate = useMemo(
    () =>
      throttle(
        (value: number | number[]) => {
          useResultViewStore.setState({
            previewPercent: value as number,
          });
        },
        300,
        {
          leading: false,
        },
      ),
    [],
  );

  return (
    <Flex className={styles.container} gap={12} align="center">
      <IconGridSmall />
      <Slider
        className={styles.slider}
        min={50}
        max={150}
        range={false}
        value={previewPercent}
        onChange={onPreviewPercentUpdate}
        formatTooltip={(value) => `${value}%`}
        getTooltipContainer={() => document.body}
      />
      <IconGridBig />
    </Flex>
  );
}
