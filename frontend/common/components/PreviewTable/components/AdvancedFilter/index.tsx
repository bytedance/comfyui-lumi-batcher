// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Button,
  Checkbox,
  Input,
  Popover,
  Space,
} from '@arco-design/web-react';
import {
  IconCaretRight,
  IconDown,
  IconSearch,
} from '@arco-design/web-react/icon';
import cn from 'classnames';

import { SortableComp } from '../SortableList';
import { RenderValue } from '../SortableList/Render';
import styles from './index.module.scss';
import { useHandle } from './share';
import { type AdvancedFilterProps } from './type';
import { EmptyList } from '@common/components/EmptyList';
import Flex from '@common/components/Flex';
import { I18n } from '@common/i18n';

export const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
  label,
  list,
  originList,
  onFilter,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const {
    currentList,
    searchList,
    searchValue,
    selectCount,
    checkNoSelected,
    emptyHeight,
    setCurrentList,
    setSearchValue,
    handleOptionsChange,
    handleSelectedChange,
    handleSelectAll,
    handleClearAll,
    handleToggleExpand,
    handleReset,
  } = useHandle(list, originList);

  useEffect(() => {
    // 同步list
    setCurrentList(list);
  }, [list, setCurrentList]);

  const finalEmptyHeight = useMemo(
    () => Math.min(maxHeight - 138, Math.max(emptyHeight, 275)),
    [emptyHeight, maxHeight],
  );

  const Content = useMemo(
    () => (
      <div className={styles.contentContainer} style={{ maxHeight }}>
        <Input
          value={searchValue}
          onChange={setSearchValue}
          className={styles.search}
          placeholder={I18n.t(
            'please_enter_a_data_item_name',
            {},
            '搜索数据项',
          )}
          suffix={<IconSearch />}
          allowClear
        />
        <div className={styles.actions}>
          <Space size={4}>
            <span className={styles.hightLightText}>
              {I18n.t('has_selected', {}, '已选')}
            </span>
            <span className={cn(styles.hightLightText, styles.countText)}>
              {selectCount}
            </span>
            <span className={styles.hightLightText}>
              {I18n.t('items', {}, '项')}
            </span>
          </Space>
          <span className={styles.clickableText} onClick={handleSelectAll}>
            {I18n.t('all_choose', {}, '全选')}
          </span>
          <span className={styles.clickableText} onClick={handleClearAll}>
            {I18n.t('clear_all', {}, '清空')}
          </span>
        </div>
        <div className={styles.selectItemContainer}>
          {/* 动态渲染，根据参数行/列，传入的配置，会有很多个可排序的列表 */}
          {searchList.length > 0 ? (
            searchList.map((item) => {
              const { id, selected, options, label, expanded } = item;
              if (options.length > 1) {
                return (
                  <div className={styles.selectItemColumn} key={id}>
                    <Flex
                      align="center"
                      justify="flex-start"
                      gap={4}
                      style={{ width: '100%' }}
                    >
                      <IconCaretRight
                        className={expanded ? styles.rotateAnimation : ''}
                        style={{ color: '#DDDEDD', cursor: 'pointer' }}
                        onClick={() => handleToggleExpand(item)}
                      />
                      <Checkbox
                        checked={selected}
                        className={styles.selectItemCheckbox}
                        onChange={(s) => {
                          handleSelectedChange(s, item);
                        }}
                      />
                      <RenderValue
                        showTooltip
                        value={[{ label: '', type: 'string', value: [label] }]}
                      />
                    </Flex>
                    <SortableComp
                      key={id}
                      list={options}
                      className={cn(
                        styles.accordionContent,
                        expanded ? styles.accordionContentExpanded : '',
                      )}
                      style={{
                        height: expanded ? 32 * options.length : 0,
                      }}
                      onChange={(newArray) => {
                        handleOptionsChange(newArray, item);
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <div className={styles.selectItemRow} key={id}>
                    <Checkbox
                      checked={searchList[0].options?.[0]?.selected ?? false}
                      className={styles.selectItemCheckbox}
                      onChange={(s) => {
                        handleSelectedChange(s, item);
                      }}
                      style={{
                        padding: '0px 8px 0px 0px',
                      }}
                    />
                    <RenderValue showTooltip value={options[0]?.value ?? ''} />
                  </div>
                );
              }
            })
          ) : (
            <EmptyList
              style={{
                height: finalEmptyHeight,
              }}
              text={I18n.t(
                'no_search_results_yet__try_searching_for_other_content',
                {},
                '暂无搜索结果，试试搜索其他内容',
              )}
            />
          )}
        </div>
        <div className={styles.footer}>
          <span className={styles.resetText} onClick={handleReset}>
            {I18n.t('reset_to_default', {}, '恢复预设')}
          </span>
          <Space size={8}>
            <Button
              status="default"
              style={{
                borderRadius: 100,
              }}
              className={styles.button}
              onClick={() => {
                setVisible(false);
              }}
            >
              {I18n.t('cancel', {}, '取消')}
            </Button>
            <Button
              type="primary"
              style={{
                borderRadius: 100,
              }}
              className={styles.button}
              onClick={() => {
                onFilter(currentList);
              }}
              disabled={checkNoSelected}
            >
              {I18n.t('confirm', {}, '确定')}
            </Button>
          </Space>
        </div>
      </div>
    ),
    [
      checkNoSelected,
      currentList,
      finalEmptyHeight,
      handleClearAll,
      handleOptionsChange,
      handleReset,
      handleSelectAll,
      handleSelectedChange,
      handleToggleExpand,
      maxHeight,
      onFilter,
      searchList,
      searchValue,
      selectCount,
      setSearchValue,
    ],
  );

  useEffect(() => {
    let n = 0;

    // 计算最大高度
    const fn = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        // 距离底部24px，margin-bottom 16px，padding: 32px
        setMaxHeight(window.innerHeight - rect.top - rect.height - 24 - 45);
      }
      n = window.requestAnimationFrame(fn);
    };
    n = window.requestAnimationFrame(fn);
    return () => {
      window.cancelAnimationFrame(n);
    };
  }, []);

  return (
    <Popover
      trigger="click"
      title={null}
      position="bl"
      //   popupVisible={true}
      popupVisible={visible}
      onVisibleChange={setVisible}
      content={Content}
      className={styles.popoverContainer}
      getPopupContainer={() => {
        if (triggerRef.current) {
          return triggerRef.current.parentElement!;
        }
        return document.body;
      }}
    >
      <div className={styles.triggerContainer} ref={triggerRef}>
        <span className={styles.text}>{label}</span>
        <IconDown
          className={cn(styles.icon, visible ? styles.rotate180Animation : '')}
        />
      </div>
    </Popover>
  );
};
