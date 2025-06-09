// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo, useState } from 'react';

import { type ResourceStatus } from '../RenderImage';
import styles from './index.module.scss';
import ResourceLoadError from '@common/components/ImageLoadError';

export const LoadImg: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = (props) => {
  const [status, setStatus] = useState<ResourceStatus>('loading');
  const StatusContent = useMemo(() => {
    if (status === 'loading') {
      return (
        <div
          className={styles.loading}
          style={{
            ...(props.style ?? {}),
          }}
        />
      );
    }

    if (status === 'failed') {
      return <ResourceLoadError />;
    }

    return null;
  }, [status]);
  return (
    <div className={styles.container}>
      <img
        width="100%"
        height="100%"
        onError={() => {
          setStatus('failed');
        }}
        onLoad={() => {
          setStatus('succeed');
        }}
        {...props}
      />

      {StatusContent}
    </div>
  );
};
