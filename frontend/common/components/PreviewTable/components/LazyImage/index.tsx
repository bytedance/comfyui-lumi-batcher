// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useEffect, useRef, useState } from 'react';

import { Image, type ImageProps } from '@arco-design/web-react';
import cn from 'classnames';

// import { useInViewOnce } from '@/common/hooks/use-in-view';
import { usePreviewTableStore } from '../../store';
import styles from './index.module.scss';

export const LazyImage: React.FC<ImageProps> = props => {
  // const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const [loading, setLoading] = useState(true);
  const observer = usePreviewTableStore(s => s.observer);
  const visibleMap = usePreviewTableStore(s => s.lazyImgVisibleMap);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [observer]);

  return (
    <div
      ref={imgRef}
      className={cn(styles.container, props.className, 'lazy-image')}
      style={props.style}
      data-src={props.src}
    >
      {/* {inView ? (
        <Image
          {...props}
          className={cn(
            styles.image,
            loading ? styles.hidden : '',
            'lazy-image',
          )}
          preview={false}
          onLoad={e => {
            props.onLoad && props.onLoad(e);
            setLoading(false);
          }}
        />
      ) : null} */}
      {visibleMap[props.src ?? ''] ? (
        <Image
          {...props}
          className={cn(styles.image, loading ? styles.hidden : '')}
          preview={false}
          onLoad={e => {
            props.onLoad && props.onLoad(e);
            setLoading(false);
          }}
        />
      ) : null}
      {loading ? <div className={styles.loading} /> : null}
    </div>
  );
};
