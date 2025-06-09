// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useState } from 'react';

import classNames from 'classnames';

import './index.scss';
import { createWithPrefix } from '@common/utils/create-with-prefix';
import useBoolean from '@common/hooks/use-boolean';

const withPrefix = createWithPrefix('home-tags');

interface TagItemProps {
  id: string;
  name: string;
  selected?: boolean;
  /** 只需要把'全部'这个选项设置为true */
  is_all?: boolean;
}

const Tags: React.FC<{
  /** 是否支持多选 */
  is_multi?: boolean;
  list: TagItemProps[];
  onClick: (data: TagItemProps[]) => void;
}> = ({ is_multi, list, onClick }) => {
  const [tags, setTags] = useState<TagItemProps[]>([]);
  const [showAll] = useBoolean(true);
  const handelSelect = (target: TagItemProps) => {
    let newTags: TagItemProps[] = [];
    // 单选模式
    if (!is_multi) {
      if (target.selected) {
        return;
      }
      newTags = tags.map((item) => ({
        ...item,
        selected: target.id === item.id ? true : false,
      }));
    } else {
      // 多选模式
      // ‘全部’选项不能点击后被取消
      if (target.is_all && target.selected) {
        return;
      }
      if (target.is_all && !target.selected) {
        newTags = tags.map((item) => ({
          ...item,
          selected: target.id === item.id ? true : false,
        }));
      } else {
        newTags = tags.map((item) => ({
          ...item,
          selected:
            target.id === item.id
              ? !target.selected
              : item.is_all
                ? false
                : item.selected,
        }));
      }
    }
    // 默认第一个'全部'选中
    if (newTags.filter((item) => item.selected).length === 0) {
      newTags[0].selected = true;
    }
    setTags(() => newTags);
    onClick(newTags.filter((item) => item.selected));
  };
  useEffect(() => {
    setTags(list);
  }, [list]);
  return (
    <div className={withPrefix('')}>
      <div
        className={classNames(withPrefix('list'), {
          [withPrefix('single')]: !showAll,
          [withPrefix('expanded')]: showAll,
        })}
      >
        {tags.map((item, index) => (
          <div
            key={index}
            className={classNames(withPrefix('normal'), {
              [withPrefix('selected')]: item.selected,
            })}
            onClick={() => handelSelect(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Tags;
