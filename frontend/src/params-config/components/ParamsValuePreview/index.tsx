// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useMemo, useState } from 'react';

import { Image, Typography } from '@arco-design/web-react';

import './index.scss';
import { getImageUrlV2 } from '@common/utils/image';
import BlobVideo from '@common/components/PreviewTable/components/BlobVideo';
import { checkParamType } from '@src/params-config/utils/check-task-param-type';

export const ParamsValuePreview: React.FC<{
  value: any;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  maxHeight?: number | string;
  isError?: boolean;
}> = ({
  value,
  width,
  height,
  maxWidth = 'unset',
  maxHeight = 'unset',
  isError = false,
}) => {
  const [type, setType] = useState(checkParamType(value));

  const Content = useMemo(() => {
    const url = getImageUrlV2(String(value), 'input', false);
    if (type === 'image') {
      return (
        <Image
          onError={() => {
            setType('text');
          }}
          className="param-value-preview-image"
          src={url}
          style={{
            maxWidth,
            maxHeight,
            border: isError
              ? '1px solid #ff453a'
              : '1px solid var(--border-color-border-1, rgba(255, 255, 255, 0.12))',
            borderRadius: 4,
          }}
          {...{ width: width ?? undefined, height: height ?? undefined }}
        />
      );
    } else if (type === 'video') {
      return (
        <BlobVideo
          src={url}
          style={{
            maxWidth,
            maxHeight,
            border: isError
              ? '1px solid #ff453a'
              : '1px solid var(--border-color-border-1, rgba(255, 255, 255, 0.12))',
            borderRadius: 4,
            objectFit: 'cover',
            marginTop: 8,
            ...{ width: width ?? undefined, height: height ?? undefined },
          }}
          clickToFullScreen
          className="param-value-preview-video"
          hoverPlay
          controls={false}
        />
      );
    } else {
      return (
        <Typography.Paragraph
          className="clear-arco-typography-margin-bottom"
          ellipsis={{
            rows: 1,
            showTooltip: true,
            wrapper: 'div',
          }}
          style={{ color: isError ? '#ff453a' : '' }}
        >
          {value}
        </Typography.Paragraph>
      );
    }
  }, [height, isError, maxHeight, maxWidth, type, value, width]);

  if (value === undefined) {
    return null;
  }

  return Content;
};
