import {
  IconFileAudio,
  IconPause,
  IconPlayArrow,
} from '@arco-design/web-react/icon';
import React from 'react';

import styles from './index.module.scss';
import cn from 'classnames';
import { Typography } from '@arco-design/web-react';

export const AudioValuePreview = (props: {
  audioProps: React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >;
  value: string;
  isError?: boolean;
  wrapperStyle?: React.CSSProperties;
}) => {
  const ref = React.useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = () => {
    ref.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    ref.current?.pause();
    setIsPlaying(false);
  };

  return (
    <div className={styles.container} style={props.wrapperStyle ?? {}}>
      <IconFileAudio className={styles.musicIcon} />
      <audio
        {...props.audioProps}
        className={cn(props.audioProps.className ?? '')}
        ref={ref}
        onEnded={(e) => {
          handlePause();
          props.audioProps.onEnded?.(e);
        }}
      >
        您的浏览器不支持音频元素。
      </audio>
      <Typography.Paragraph
        ellipsis={{
          rows: 1,
          showTooltip: true,
          wrapper: 'div',
        }}
        style={{ color: props.isError ? '#ff453a' : '', marginBottom: 0 }}
      >
        {typeof props.value === 'string' ? props.value : String(props.value)}
      </Typography.Paragraph>
      {isPlaying ? (
        <IconPause className={styles.playIcon} onClick={handlePause} />
      ) : (
        <IconPlayArrow className={styles.playIcon} onClick={handlePlay} />
      )}
    </div>
  );
};
