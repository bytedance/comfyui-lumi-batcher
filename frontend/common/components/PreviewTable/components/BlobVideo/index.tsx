// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Tag } from '@arco-design/web-react';

// import { fetchAndPlayVideo } from '@/api/batch-task/fetch';
import { formatTime } from '../../utils/time';
import styles from './index.module.scss';

export const BlobVideo: React.FC<
  React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
  > & {
    hoverPlay?: boolean;
    showTime?: boolean;
    clickToFullScreen?: boolean;
  }
> = (props) => {
  const {
    hoverPlay = false,
    showTime = false,
    clickToFullScreen = false,
  } = props;
  const [videoDom, setVideoDom] = useState<HTMLVideoElement | null>(null);
  const [timeText, setTimeText] = useState<string>('00:00 / 00:00');
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { src = '' } = props;
  const [currentSrc, setCurrentSrc] = useState('');

  useEffect(() => {
    // fetchAndPlayVideo(src).then((data = '') => {
    //   setCurrentSrc(data);
    // });
    setCurrentSrc(src);
  }, [src]);

  /** 注册hover播放逻辑 */
  useEffect(() => {
    if (!videoDom || !hoverPlay || isFullScreen) {
      return;
    }
    const handleMouseEnter = () => {
      videoDom.play();
    };
    const handleMouseLeave = () => {
      videoDom.pause();
      videoDom.currentTime = 0;
    };
    videoDom.addEventListener('mouseover', handleMouseEnter);
    videoDom.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      videoDom.removeEventListener('mouseenter', handleMouseEnter);
      videoDom.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hoverPlay, videoDom, isFullScreen]);

  const handleClickFullScreen = () => {
    if (!clickToFullScreen) {
      return;
    }
    if (videoDom?.requestFullscreen) {
      videoDom.requestFullscreen();
    }
  };

  useEffect(() => {
    if (!videoDom) {
      return;
    }

    // 更新时间显示
    function updateTimeDisplay() {
      if (!videoDom) {
        return;
      }
      const currentTime = formatTime(videoDom.currentTime);
      const duration = formatTime(videoDom.duration);
      setTimeText(`${currentTime} / ${duration}`);
    }

    // 监听 video 的 timeupdate 事件
    videoDom.addEventListener('timeupdate', updateTimeDisplay);

    // 监听 video 的 loadedmetadata 事件，以确保视频元数据加载完成后显示总时长
    videoDom.addEventListener('loadedmetadata', updateTimeDisplay);
  }, [videoDom]);

  const TagContent = useMemo(() => {
    if (!showTime) {
      return null;
    }
    return (
      <Tag className={styles.tag} color="rgba(40, 40, 40, 0.58)">
        {timeText}
      </Tag>
    );
  }, [showTime, timeText]);

  useEffect(() => {
    if (!videoDom || !clickToFullScreen) {
      return;
    }
    // 使用更可靠的全屏事件监听方式
    const handleFullscreenChange = () => {
      const isFullscreen = document.fullscreenElement === videoDom;
      setIsFullScreen(isFullscreen);
      videoDom.style.objectFit = isFullscreen ? 'contain' : 'cover';
    };

    // 添加事件监听
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // 返回清理函数
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [clickToFullScreen, videoDom]);

  if (!currentSrc) {
    return null;
  }

  return (
    <>
      <video
        ref={setVideoDom}
        onClick={handleClickFullScreen}
        controls={true}
        {...props}
        style={{
          ...(props.style ?? {}),
          cursor: clickToFullScreen ? 'zoom-in' : 'default',
        }}
        src={currentSrc}
      />
      {TagContent}
    </>
  );
};

export default BlobVideo;
