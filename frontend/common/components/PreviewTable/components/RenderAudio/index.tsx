import type React from 'react';
import { useMemo, useRef, useState } from 'react';

import { type AtomValueType } from '../../type/table';
import AudioPlayer from '../AudioPlayer';
import styles from './index.module.scss';
import ResourceLoadError from '@common/components/ImageLoadError';

export type ResourceStatus = 'loading' | 'succeed' | 'failed';

export const RenderAudio: React.FC<{
  value: AtomValueType;
}> = (props) => {
  const { value } = props;
  const srcList = value.value;
  const [status, setStatus] = useState<ResourceStatus>('loading');
  const [currentValue] = useState<string>(srcList[0]);
  const divRef = useRef<HTMLDivElement>(null);

  const StatusContent = useMemo(() => {
    if (status === 'loading') {
      return <div className={styles.loading} />;
    }

    if (status === 'failed') {
      return <ResourceLoadError />;
    }

    return null;
  }, [status]);

  return (
    <div
      className={styles.container}
      ref={divRef}
      data-src={JSON.stringify(srcList)}
    >
      <AudioPlayer
        src={currentValue}
        onCanPlay={() => {
          setStatus('succeed');
        }}
        onError={() => {
          setStatus('failed');
        }}
        autoPlay={false}
      />
      {StatusContent}
    </div>
  );
};
