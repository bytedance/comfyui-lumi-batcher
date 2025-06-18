// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useState } from 'react';

import { Button, Checkbox, Space } from '@arco-design/web-react';

import styles from './index.module.scss';
import { I18n } from '@common/i18n';
import { LanguagesEnum, languageUtils } from '@common/language';

export type FilterValue = Array<any>;

export type FilterListType = Array<{
  label: string;
  value: any;
}>;

export const CustomFilters = (props: {
  filterList: FilterListType;
  value: FilterValue;
  onOk?: (value: Array<any>) => void;
  onReset?: () => void;
}) => {
  const { filterList, value, onOk, onReset } = props;
  const [currentValue, setCurrentValue] = useState<any>(() => value);
  return (
    <div
      className={styles.container}
      style={{
        width: languageUtils.getLanguage() === LanguagesEnum.ZH ? 124 : 180,
      }}
    >
      <Checkbox.Group
        defaultValue={value}
        className={styles.checkbox}
        value={currentValue}
        options={filterList}
        onChange={setCurrentValue}
      />
      <Space className={styles.operator}>
        <Button
          size="mini"
          status="default"
          onClick={() => onReset && onReset()}
        >
          {I18n.t('reset', {}, '重置')}
        </Button>
        <Button
          size="mini"
          type="primary"
          onClick={() => onOk && onOk(currentValue)}
        >
          {I18n.t('ok', {}, '确定')}
        </Button>
      </Space>
    </div>
  );
};
