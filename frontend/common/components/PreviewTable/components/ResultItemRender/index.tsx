// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';

import { Image } from '@arco-design/web-react';

import BlobVideo from '../BlobVideo';
import { LoadImg } from '../LoadImg';
import { CustomChange } from '../modal-preview/custom-change';
import styles from './index.module.scss';
import { ResultItem, ResultOutputTypeEnum } from '@api/result';
import { I18n } from '@common/i18n';
import { IconDownload } from '@arco-design/web-react/icon';
import { batchDownloadByFetchUrl } from '@api/download';

export const ResultItemRender: React.FC<{
  objectFit?: 'contain' | 'cover';
  renderMode?: 'full' | 'clean';
  isMulti?: boolean;
  result: ResultItem;
  onClose: () => void;
  getPopupContainer?: () => HTMLElement;
  extra?: React.ReactNode;
  withCustomChange?: boolean;
}> = ({
  renderMode = 'full',
  isMulti = false,
  objectFit,
  result,
  extra = null,
  onClose,
  getPopupContainer,
  withCustomChange = true,
}) => {
  const { url, type } = result;

  const searchParams = new URLSearchParams(url.split('?')[1]);
  const fileName = searchParams.get('file_name');

  const handleDownloadFile = () => {
    if (fileName) {
      batchDownloadByFetchUrl(url, fileName);
    } else {
      console.log('fileName is empty');
    }
  };

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
        extra={
          <>
            <CustomChange isMulti={isMulti} />
            {extra ? extra : null}
          </>
        }
        getPopupContainer={
          getPopupContainer ? getPopupContainer : () => document.body
        }
        actions={[
          {
            key: 'download',
            name: I18n.t('download', {}, '下载'),
            content: <IconDownload onClick={handleDownloadFile} />,
          },
        ]}
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
      <>
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
        {withCustomChange ? <CustomChange isMulti={isMulti} /> : null}
      </>
    );
  }

  return null;
};
