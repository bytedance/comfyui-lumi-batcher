// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useCallback, useRef } from 'react';

import {
  Popconfirm,
  Popover,
  Select,
  Typography,
} from '@arco-design/web-react';
import { IconDown, IconQuestionCircle } from '@arco-design/web-react/icon';
import cx from 'classnames';

import styles from './index.module.scss';
import useBoolean from '@common/hooks/use-boolean';
import Flex from '@common/components/Flex';
import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '@common/language';

export interface Option {
  label: string;
  value: string;
  extra: any;
}

export interface ConfigTableParamsProps {
  options: Option[];
  value?: Option['value'];
  shouldChangeConfirm?: boolean;
  onSelect: (value: Option['value'], index: number) => void;
}

export default function ConfigTableParams({
  options,
  value,
  shouldChangeConfirm = false,
  onSelect,
}: ConfigTableParamsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [popoverVisible, popoverActions] = useBoolean();

  const renderText = useCallback(
    (label: string) => (
      <Typography.Ellipsis
        style={{
          marginBottom: 0,
          lineHeight: 'unset',
        }}
        rows={1}
        showTooltip={true}
      >
        {label}
      </Typography.Ellipsis>
    ),
    [],
  );

  return (
    <div ref={rootRef}>
      <Popover
        className={styles.container}
        position="bl"
        trigger="click"
        content={
          <Flex direction="column" align="flex-start" gap={8}>
            <Flex
              className={styles.contentTitle}
              justify="center"
              align="center"
              gap={4}
            >
              {languageUtils.getText(TranslateKeys.TABLE_CONFIG_GROUP)}
              <IconQuestionCircle />
            </Flex>
            <Select
              className={styles.contentSelector}
              placeholder={languageUtils.getText(
                TranslateKeys.SELECT_PARAM_PLACEHOLDER,
              )}
              value={value}
              renderFormat={() => {
                const currentOption = options.find(
                  (item) => item.value === value,
                ) || { label: '' };
                return renderText(currentOption.label);
              }}
              onChange={(value) => {
                const index = options.findIndex((item) => item.value === value);
                onSelect(value, index);
              }}
            >
              {options.map((option, index) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  extra={option.extra}
                >
                  <div
                    key={option.value}
                    onClick={(e) => {
                      if (shouldChangeConfirm) {
                        e.stopPropagation();
                      }
                    }}
                  >
                    <Popconfirm
                      disabled={!shouldChangeConfirm}
                      trigger="click"
                      title={I18n.t(
                        'Are_you_sure_you_want_to_switch_the_table_configuration?_the_current_custom_row__column_configuration_will_be_cleared',
                        {},
                        '确定切换表格配置吗，切换后将清空当前自定义行、列配置',
                      )}
                      content={null}
                      onOk={() => {
                        onSelect(option.value, index);
                      }}
                      position="rt"
                    >
                      <div>{renderText(option.label)}</div>
                    </Popconfirm>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Flex>
        }
        popupVisible={popoverVisible}
        onVisibleChange={popoverActions.toggle}
        getPopupContainer={() => rootRef.current!}
      >
        <Flex
          className={cx(styles.popoverBtn, {
            [styles.popoverOpen]: popoverVisible,
          })}
          align="center"
          gap={4}
        >
          {languageUtils.getText(TranslateKeys.TABLE_CONFIG_BOARD)}{' '}
          <IconDown style={{ fontSize: 12 }} />
        </Flex>
      </Popover>
    </div>
  );
}
