/* eslint-disable max-lines-per-function */
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { IconMusic } from '@arco-design/web-react/icon';

import './index.scss';

interface AudioPlayerProps {
  src: string;
  onEnded?: () => void;
  onCanPlay?: () => void;
  onError?: () => void;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  onEnded,
  autoPlay = false,
  onCanPlay,
  onError,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [currentSeekTime, setCurrentSeekTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 格式化时间显示
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 播放/暂停控制
  const togglePlay = () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error('播放失败:', err);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // 进度条拖动开始
  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  // 进度条拖动中
  const handleSeekMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentSeekTime(seekTime);
  };

  // 进度条拖动结束
  const handleSeekEnd = (e: any) => {
    if (!audioRef.current) {
      return;
    }

    const seekTime = parseFloat(e.target?.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setIsSeeking(false);
  };

  // 音量控制
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) {
      return;
    }

    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
    setIsMuted(newVolume === 0);
  };

  // 静音切换
  const toggleMute = () => {
    if (!audioRef.current) {
      return;
    }

    if (isMuted) {
      audioRef.current.volume = volume / 100;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // 播放速度控制
  const handlePlaybackRateChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!audioRef.current) {
      return;
    }

    const rate = parseFloat(e.target.value);
    audioRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  // 更新播放时间
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const updateTime = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    return () => audio.removeEventListener('timeupdate', updateTime);
  }, [isSeeking]);

  // 加载完成设置持续时间
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => audio.removeEventListener('loadedmetadata', onLoadedMetadata);
  }, []);

  // 监听播放结束事件
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) {
        onEnded();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [onEnded]);

  // 设置自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (autoPlay) {
      audio.play().catch((err) => {
        console.error('自动播放失败:', err);
        setIsPlaying(false);
      });
    }
  }, [autoPlay]);

  // 初始音量设置
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.volume = volume / 100;
  }, []);

  return (
    <div className="audio-player">
      {!isLoading && (
        <div className="audio-player__content">
          <div className="audio-player__info">
            <div className="audio-player__cover">
              <IconMusic style={{ fontSize: 32 }} />
            </div>
          </div>

          {/* 播放控制 */}
          <div className="audio-player__controls">
            {/* 进度条 */}
            <div className="audio-player__progress-container">
              <button
                className="audio-player__button audio-player__button--large"
                onClick={togglePlay}
                aria-label={isPlaying ? '暂停' : '播放'}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24">
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  ) : (
                    <path d="M8 5v14l11-7z" />
                  )}
                </svg>
              </button>

              <span className="audio-player__time">
                {formatTime(isSeeking ? currentSeekTime : currentTime)}
              </span>
              <input
                type="range"
                className="audio-player__progress"
                min="0"
                max={duration || 100}
                value={isSeeking ? currentSeekTime : currentTime}
                onChange={handleSeekMove}
                onMouseDown={handleSeekStart}
                onMouseUp={handleSeekEnd}
                onTouchStart={handleSeekStart}
                onTouchEnd={handleSeekEnd}
                disabled={isLoading}
              />
              <span className="audio-player__time">{formatTime(duration)}</span>
              <button
                className="audio-player__button"
                onClick={toggleMute}
                aria-label={isMuted ? '取消静音' : '静音'}
              >
                <svg viewBox="0 0 24 24">
                  {isMuted ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  )}
                </svg>
              </button>
              <select
                value={playbackRate}
                onChange={handlePlaybackRateChange}
                className="audio-player__rate-select"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2.0x</option>
              </select>
            </div>

            {/* 控制按钮 */}
            <div className="audio-player__buttons" />

            {/* 音量控制 */}
            {/* <div className="audio-player__volume">
            <input
              type="range"
              className="audio-player__volume-slider"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="音量"
            />
          </div> */}
          </div>
        </div>
      )}

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onCanPlay={() => onCanPlay?.()}
        onError={() => onError?.()}
      />
    </div>
  );
};

export default AudioPlayer;
