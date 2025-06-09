// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useMemo, useState } from 'react';

import { Carousel, Tag } from '@arco-design/web-react';
import cn from 'classnames';

import { ReactComponent as SvgTagImg } from '@static/icons/img-tag.svg';

import { usePreviewTableStore } from '../../store';
import { type AtomValueType } from '../../type/table';
import { LazyImage } from '../LazyImage';
import { openPreviewModal } from '../modal-preview';
import styles from './index.module.scss';
import { ResultOutputTypeEnum } from '@api/result';
import ResourceLoadError from '@common/components/ImageLoadError';
import { I18n } from '@common/i18n';

export type ResourceStatus = 'loading' | 'succeed' | 'failed';

export const RenderImage: React.FC<{
  value: AtomValueType;
}> = ({ value }) => {
  const srcList = value.value;
  const [status, setStatus] = useState<ResourceStatus>('loading');
  const [currentValue, setCurrentValue] = useState<string>(srcList[0]);

  const StatusContent = useMemo(() => {
    if (status === 'loading') {
      return null;
    }

    if (status === 'failed') {
      return (
        <ResourceLoadError
          styles={{
            width: '100%',
            height: '100%',
            aspectRatio: 1,
          }}
        />
      );
    }

    return null;
  }, [status]);

  const TagContent = useMemo(() => {
    if (status === 'succeed' && srcList.length > 1) {
      return (
        <Tag
          className={styles.tag}
          color="rgba(40, 40, 40, 0.58)"
          icon={<SvgTagImg />}
        >
          {`${I18n.t(
            'a_total_of_{placeholder1}_sheets',
            { placeholder1: srcList.length },
            '共{placeholder1}张',
          )}`}
        </Tag>
      );
    }
    return null;
  }, [srcList.length, status]);

  return (
    <div className={styles.container}>
      <Carousel
        className={cn(
          styles.carousel,
          status === 'loading' ? styles.hiddenCarousel : '',
        )}
        indicatorType="line"
        onChange={(i) => setCurrentValue(srcList[i])}
      >
        {srcList.map((src, index) => (
          <LazyImage
            key={index}
            className={styles.image}
            width="100%"
            src={currentValue}
            onError={() => {
              setStatus('failed');
            }}
            error={null}
            preview={false}
            onClick={() => {
              openPreviewModal({
                onClose: () => {
                  usePreviewTableStore.setState({
                    preview: undefined,
                  });
                },
              });
              usePreviewTableStore.setState({
                preview: srcList.map((i) => ({
                  type: ResultOutputTypeEnum.Image,
                  url: i,
                })),
              });
            }}
            onLoad={() => {
              setStatus('succeed');
            }}
          />
        ))}
      </Carousel>

      {StatusContent}

      {TagContent}

      {/* {preview && preview.length > 0 ? (
        <ModalPreview
          results={preview}
          onClose={() => {
            usePreviewTableStore.setState({
              preview: undefined,
            });
          }}
        />
      ) : null} */}
    </div>
  );
};
