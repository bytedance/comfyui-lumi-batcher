// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import { useShallow } from 'zustand/react/shallow';

import { ReactComponent as TipIcon } from '@static/icons/tip.svg';

import { NumberDom, paramsConfigAnalysis } from '../../share';
import { useCreatorStore } from '../../store';

import './index.scss';
import { languageUtils, TranslateKeys } from '@common/language';

const defaultData = [
  NumberDom(
    0,
    `${languageUtils.getText(
      TranslateKeys.PARAM_VALUES_COUNT_UNIT,
    )}(${languageUtils.getText(TranslateKeys.PARAM_NAME)}1) x`,
  ),
  NumberDom(
    0,
    `${languageUtils.getText(
      TranslateKeys.PARAM_VALUES_COUNT_UNIT,
    )}(${languageUtils.getText(TranslateKeys.PARAM_NAME)}2) x`,
  ),
  '... x ',
  NumberDom(
    0,
    `${languageUtils.getText(
      TranslateKeys.PARAM_VALUES_COUNT_UNIT,
    )}(${languageUtils.getText(TranslateKeys.PARAM_NAME)}N)`,
  ),
];

export const CreatorCount = () => {
  const [paramsConfig] = useCreatorStore(useShallow((s) => [s.paramsConfig]));

  const paramsConfigResult = useMemo(
    () => paramsConfigAnalysis(paramsConfig),
    [paramsConfig],
  );

  return (
    <section className="batch-tools-count">
      <div className="batch-tools-count-label">
        <TipIcon style={{ marginRight: 4 }} />
        {NumberDom(paramsConfigResult.count)}
        {languageUtils.getText(TranslateKeys.PARAM_VALUES_COUNT_UNIT)}(
        {languageUtils.getText(TranslateKeys.FINAL_RESULT_COUNT)}) ={' '}
        {paramsConfigResult.domList.length
          ? paramsConfigResult.domList
          : defaultData}
      </div>
    </section>
  );
};
