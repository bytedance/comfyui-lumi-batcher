// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useMemo, useState } from 'react';

import _ from 'lodash';

import { type SortableItemProps } from '../SortableList/type';
import { type AdvancedFilterItem } from './type';

export const useHandle = (
  list: AdvancedFilterItem[],
  originList: AdvancedFilterItem[],
) => {
  const [currentList, setCurrentList] = useState<AdvancedFilterItem[]>(list);
  const [searchValue, setSearchValue] = useState('');
  const [emptyHeight, setEmptyHeight] = useState(0);
  const handleOptionsChange = (
    newOptions: SortableItemProps[],
    item: AdvancedFilterItem,
  ) => {
    const newArray = _.cloneDeep(currentList);
    const temp = newArray.find((i) => i.id === item.id);
    if (!temp) {
      return;
    }
    // 处理选项变化
    temp.options = temp.options.map((option) => {
      const newOption = newOptions.find((i) => i.id === option.id);
      if (newOption) {
        return newOption;
      } else {
        return option;
      }
    });
    // 处理排序
    const newIds = newOptions.map((i) => i.id);

    const resArr = [];
    const newIdSet = new Set(newIds);
    let currIndex = 0;

    for (let i = 0; i < temp.options.length; i++) {
      const o = temp.options[i];
      if (newIdSet.has(o.id)) {
        resArr.push(newOptions[currIndex]);
        currIndex++;
      } else {
        resArr.push(o);
      }
    }

    temp.options = resArr;

    if (resArr.every((item) => item.selected)) {
      temp.selected = true;
    } else {
      temp.selected = false;
    }

    setCurrentList(newArray);
  };
  const handleSelectedChange = (
    selected: boolean,
    item: AdvancedFilterItem,
  ) => {
    const newArray = _.cloneDeep(currentList).map((i) => {
      if (i.id === item.id) {
        i.options = i.options.map((option) => {
          const t = item.options.find((i) => i.id === option.id);
          if (t) {
            option.selected = selected;
          }
          return option;
        });
        i.selected = i.options.every((option) => option.selected);
        return i;
      }

      return i;
    });

    // 处理选中状态变化
    setCurrentList(newArray);
  };
  const handleSelectAll = () => {
    const newArray = _.cloneDeep(currentList);
    newArray.forEach((item) => {
      item.selected = true;
      item.options = item.options.map((item) => {
        item.selected = true;
        return item;
      });
    });
    setCurrentList(newArray);
  };
  const handleClearAll = () => {
    const newArray = _.cloneDeep(currentList);
    newArray.forEach((item) => {
      item.selected = false;
      item.options = item.options.map((item) => {
        item.selected = false;
        return item;
      });
    });
    setCurrentList(newArray);
  };
  const selectCount = useMemo(
    () =>
      currentList.reduce((pre, cur) => {
        if (cur.selected) {
          return pre + cur.options.length;
        } else {
          return pre + cur.options.filter((item) => item.selected).length;
        }
      }, 0),
    [currentList],
  );

  const handleToggleExpand = (item: AdvancedFilterItem) => {
    const newArray = _.cloneDeep(currentList);
    const temp = newArray.find((i) => i.id === item.id);
    if (!temp) {
      return;
    }
    temp.expanded = !temp.expanded;
    setCurrentList(newArray);
  };

  const searchList = useMemo(() => {
    if (!searchValue) {
      return currentList;
    }
    const newList = _.cloneDeep(currentList).filter((item) => {
      item.options = item.options.filter(
        (option) => option.id.indexOf(searchValue) !== -1,
      );
      if (item.options.length > 0) {
        return true;
      } else {
        return false;
      }
    });

    return newList;
  }, [currentList, searchValue]);

  const checkNoSelected = useMemo(
    () =>
      currentList.every((item) => {
        if (item.selected) {
          return false;
        } else {
          return item.options.every((option) => !option.selected);
        }
      }),
    [currentList],
  );

  const handleReset = () => {
    setCurrentList(originList);
    setSearchValue('');
  };

  useEffect(() => {
    if (searchList.length === 0) {
      return;
    }
    const height = searchList.reduce((pre, cur) => {
      if (cur.expanded) {
        if (cur.options.length > 1) {
          return pre + 32 + 32 * cur.options.length;
        } else {
          return pre + 32;
        }
      } else {
        return pre;
      }
    }, 0);
    setEmptyHeight(height);
  }, [searchList]);

  return {
    currentList,
    selectCount,
    searchList,
    searchValue,
    checkNoSelected,
    emptyHeight,
    setEmptyHeight,
    setSearchValue,
    setCurrentList,
    handleOptionsChange,
    handleSelectedChange,
    handleSelectAll,
    handleClearAll,
    handleToggleExpand,
    handleReset,
  };
};
