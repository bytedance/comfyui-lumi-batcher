// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useMemo, useState } from 'react';

import { Button, InputNumber, Trigger } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';

import { randomSeed } from './share';

import './index.scss';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { I18n } from '@common/i18n';

export interface RandomSeedProps {
  config: ParamsConfigTypeItem;
  rootDomRef: React.RefObject<HTMLDivElement>;
  inputDomRef?: any;
  onChange: (res: number[]) => void;
}

export const RandomSeed: React.FC<RandomSeedProps> = ({
  config,
  rootDomRef,
  // inputDomRef,
  onChange,
}) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [count, setCount] = useState<number>(0);

  const updateRect = () => {
    setRect(rootDomRef.current?.getBoundingClientRect() || null);
  };

  const onOk = () => {
    setPopupVisible(false);
    onChange(randomSeed(count));
  };

  const ContentComp = useMemo(
    () => (
      <div className="random-seed-content" style={{ width: rect?.width }}>
        <section className="random-seed-content-header">
          <p className="random-seed-content-header-title">
            {I18n.t(
              'random_seed_{placeholder1}',
              { placeholder1: config.internal_name ?? '' },
              '随机种子{placeholder1}',
            )}
          </p>
          <IconClose onClick={() => setPopupVisible(false)} />
        </section>

        <section className="random-seed-content-main">
          <InputNumber
            placeholder={I18n.t(
              'please_enter_the_number_you_want_to_generate_randomly_',
              {},
              '请输入你想随机生成的个数',
            )}
            onChange={setCount}
          />
        </section>

        <section className="random-seed-content-footer">
          <Button type="secondary" onClick={() => setPopupVisible(false)}>
            {I18n.t('cancel', {}, '取消')}
          </Button>
          <Button
            type="primary"
            onClick={onOk}
            style={{ marginLeft: 8 }}
            disabled={!count}
          >
            {I18n.t('ok', {}, '确定')}
          </Button>
        </section>
      </div>
    ),
    [count, onOk, rect, popupVisible],
  );

  return (
    <Trigger
      popupVisible={popupVisible}
      showArrow
      trigger="click"
      position="bl"
      popup={() => ContentComp}
      onVisibleChange={(v) => {
        updateRect();
        setPopupVisible(v);
      }}
      getPopupContainer={() =>
        rootDomRef.current as NonNullable<HTMLDivElement>
      }
    >
      <p
        className="random-seed-trigger-text"
        onClick={() => {
          setPopupVisible(true);
        }}
      >
        {I18n.t('random_generation', {}, '随机生成')}
      </p>
    </Trigger>
  );
};
