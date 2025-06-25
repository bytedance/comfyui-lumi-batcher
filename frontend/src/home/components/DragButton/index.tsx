// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button } from '@arco-design/web-react';
import { openModal } from '@src/open-modal';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as LogoIcon } from '@static/icons/home/logo.svg';
import styles from './index.module.scss';
import { debounce } from 'lodash';

const localStorageKey = 'dragButtonPosition';

type PositionType = {
  x: number;
  y: number;
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
};

export const DragButton = () => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [position, setPosition] = useState<PositionType>({
    x: window.innerWidth - 24,
    y: 60,
    top: 60,
    right: 24,
  });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const isClickRef = useRef(false);
  const isDraggingRef = useRef(false);
  const updateTimerRef = useRef<NodeJS.Timeout>();

  const handleUpdateStorage = (pos: PositionType) => {
    localStorage.setItem(localStorageKey, JSON.stringify(pos));
  };

  const debouncedUpdate = useMemo(
    () => debounce(handleUpdateStorage, 200),
    [handleUpdateStorage],
  );

  useEffect(() => {
    debouncedUpdate(position);
    return () => debouncedUpdate.cancel();
  }, [position, debouncedUpdate]);

  // 在状态更新时同步ref
  useEffect(() => {
    isClickRef.current = isClick;
    isDraggingRef.current = isDragging;
  }, [isClick, isDragging]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const isDrag =
      Math.abs(e.clientX - dragStartPos.current.x) > 5 ||
      Math.abs(e.clientY - dragStartPos.current.y) > 5;

    if (isDrag) {
      setIsClick(false);
      setIsDragging(true);
      setPosition((prev) => {
        const newY = Math.min(
          window.innerHeight - 40,
          Math.max(0, prev.y + e.movementY),
        );
        const newX = Math.max(
          0,
          Math.min(window.innerWidth, prev.x + e.movementX),
        );

        if (newX < 220) {
          return {
            x: newX,
            y: newY,
            left: Math.max(0, newX),
            top: newY,
          };
        } else {
          return {
            x: newX,
            y: newY,
            right: Math.max(0, window.innerWidth - newX),
            top: newY,
          };
        }
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    // 使用ref来获取最新状态
    const currentIsClick = isClickRef.current;
    const currentIsDragging = isDraggingRef.current;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (currentIsClick && !currentIsDragging) {
      openModal();
    }

    setIsClick(false);
    setIsDragging(false);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      setIsClick(true);
      setIsDragging(false);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseUp, handleMouseMove],
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsClick(false);
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    const pos = localStorage.getItem(localStorageKey);
    if (pos) {
      setPosition(JSON.parse(pos));
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Button
      ref={ref}
      className={styles.button}
      type="primary"
      size="small"
      icon={<LogoIcon />}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        opacity: isDragging ? 0.5 : 1,
        height: 40,
        padding: 8,
        transition: 'width 0.3s ease',
        ...position,
      }}
    >
      ComfyUI-Lumi-Batcher
    </Button>
  );
};
