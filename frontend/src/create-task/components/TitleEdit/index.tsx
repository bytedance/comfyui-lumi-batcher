// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useState } from 'react';

import { Input, Space } from '@arco-design/web-react';
import cn from 'classnames';

import { ReactComponent as EditIcon } from '@static/icons/edit.svg';

import './index.scss';

interface Params {
  title: string;
  onChange: (value: string) => void;
}

const TitleEdit: React.FC<Params> = ({ title, onChange }) => {
  const [editStatus, setEditStatus] = useState(false);
  // 处理Title输入
  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 || e.code === 'Enter') {
      setEditStatus(false);
      onChange(e.target.value.trim());
    }
  };
  const handleTitleChange = (e: any) => {
    onChange(e.target.value.trim());
    setEditStatus(false);
  };
  return (
    <Space className="title-edit">
      {editStatus ? (
        <Space style={{ width: 300 }}>
          <Input
            className={cn('title-edit-input')}
            onKeyDown={handleKeyDown}
            onBlur={handleTitleChange}
            autoFocus
            maxLength={50}
            defaultValue={title}
          />
        </Space>
      ) : (
        <p
          className="title-edit-wrapper"
          onClick={setEditStatus.bind(this, true)}
        >
          <span className={cn('title-edit-text')}>{title}</span>
          <EditIcon />
        </p>
      )}
    </Space>
  );
};
export default TitleEdit;
