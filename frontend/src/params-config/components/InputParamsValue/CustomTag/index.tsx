// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { Tag, Typography } from '@arco-design/web-react';
import { type ObjectValueType } from '@arco-design/web-react/es/InputTag/interface';

export const CustomTag: React.FC<{
  props: {
    value?: any;
    label: ReactNode;
    closable: boolean;
    onClose: (event: any) => void;
  };
  index: number;
  values: ObjectValueType[];
  internal_name: string;
  rootRef: React.RefObject<HTMLDivElement>;
}> = ({ props, index, values, internal_name, rootRef }) => {
  const { label, closable, onClose } = props;

  const tagCount = values.length;

  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = () => {
    setRect(rootRef.current?.getBoundingClientRect() || null);
  };

  useEffect(() => {
    updateRect();
  }, []);

  const suffixWidth = 54;

  const tagInfo = useMemo(() => {
    if (!rect) {
      return {
        count: 3,
        width: 100,
      };
    }
    const { width } = rect;

    if (width <= 100 + suffixWidth) {
      return {
        count: 1,
        width: width - suffixWidth,
      };
    } else {
      const count = Math.floor((width - suffixWidth) / 100);
      return {
        count,
        width: 100,
      };
    }
  }, [rect]);

  const maxText = useMemo(() => {
    if (index > 0) {
      return null;
    }

    return (
      <Typography.Paragraph
        className="clear-arco-typography-margin-bottom"
        ellipsis={{
          rows: 1,
          showTooltip: true,
          wrapper: 'div',
        }}
        style={{
          marginLeft: 8,
          width: rect?.width ? rect?.width - suffixWidth - 18 : 100,
        }}
      >
        {`${tagCount} ${internal_name} values selected`}
      </Typography.Paragraph>
    );
  }, [rect, index, tagCount, internal_name]);

  return (
    <>
      {tagCount > tagInfo.count ? (
        maxText
      ) : (
        <Tag
          closable={closable}
          onClose={onClose}
          style={{ margin: '2px 6px 2px 0', maxWidth: tagInfo.width }}
        >
          <Typography.Paragraph
            className="clear-arco-typography-margin-bottom"
            ellipsis={{
              rows: 1,
              showTooltip: true,
              wrapper: 'span',
            }}
          >
            {label}
          </Typography.Paragraph>
        </Tag>
      )}
    </>
  );
};
