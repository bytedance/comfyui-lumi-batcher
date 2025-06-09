// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import { Image } from '@arco-design/web-react';

import BlobVideo from '../BlobVideo';
import { LoadImg } from '../LoadImg';
import { CustomChange } from '../modal-preview/custom-change';
import styles from './index.module.scss';
import { ResultItem, ResultOutputTypeEnum } from '@api/result';

export const ResultItemRender: React.FC<{
  objectFit?: 'contain' | 'cover';
  renderMode?: 'full' | 'clean';
  result: ResultItem;
  onClose: () => void;
}> = ({ renderMode = 'full', objectFit, result, onClose }) => {
  const { url, type } = result;

  if (type === ResultOutputTypeEnum.Image) {
    return renderMode === 'full' ? (
      <Image.Preview
        className={styles.container}
        visible={true}
        src={url}
        onVisibleChange={onClose}
        style={{
          objectFit,
          background: 'var(--color-fill-2)',
        }}
        extra={<CustomChange />}
      />
    ) : (
      <div
        className={styles.container}
        style={{
          background: 'var(--color-fill-2)',
        }}
      >
        <LoadImg style={{ objectFit }} src={url} />
      </div>
    );
  } else if (type === ResultOutputTypeEnum.Video) {
    return (
      <BlobVideo
        className={styles.video}
        width="100%"
        src={url}
        controls={renderMode === 'full'}
        style={{
          objectFit,
        }}
        hoverPlay
      />
    );
  }

  return null;
};
