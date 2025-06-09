// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import {
  type CSSProperties,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Input, Tooltip, TooltipProps } from '@arco-design/web-react';
import { type RefInputType } from '@arco-design/web-react/es/Input/interface';
import { IconEdit } from '@arco-design/web-react/icon';

interface AutoResizeInputProps {
  className?: string;
  style?: CSSProperties;
  value?: string;
  onChange?: (v: string) => void;
  fontSize?: number;
  maxWidth?: number;
  maxLength?: number;
  tooltipProps?: TooltipProps;
}

/**
 * This is a input bar which has a edit button on right side
 * the content can only be edited after clicking the edit button
 * the width of the input bar will be auto-resized based on length of content
 */
export default function AutoResizeInput({
  className,
  style,
  value,
  onChange,
  fontSize = 24,
  maxWidth = 600,
  maxLength = 100,
  tooltipProps = {},
}: AutoResizeInputProps): ReactElement {
  const inputRef = useRef<RefInputType>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const objectRef = useRef<HTMLDivElement>(null);

  const [currentValue, setCurrentValue] = useState(() => value);

  const [width, setWidth] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    setWidth(
      (spanRef.current?.offsetWidth ?? 100) > maxWidth
        ? maxWidth
        : (spanRef.current?.offsetWidth ?? 100),
    );
  }, [currentValue]);

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13 || e.code === 'Enter') {
      inputRef.current?.blur();
    }
  };

  const handleTitleChange = (e: any) => {
    onChange && onChange(e.target.value.trim());
    setIsEditing(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!currentValue && !isEditing) {
      setCurrentValue(value);
    }
  }, [value, currentValue, isEditing]);

  return (
    <div
      ref={objectRef}
      className={className}
      style={{ ...style, position: 'relative', marginRight: 16 }}
    >
      <Tooltip
        {...tooltipProps}
        content={width === maxWidth ? currentValue : undefined}
      >
        <Input
          ref={inputRef}
          value={currentValue}
          onChange={setCurrentValue}
          maxLength={maxLength}
          onKeyDown={handleKeyDown}
          onBlur={handleTitleChange}
          onFocus={() => setIsEditing(true)}
          style={{
            width: width + 10,
            maxWidth: width + 10,
            border: 0,
            borderRadius: 0,
            background: '#fff0',
            padding: 0,
            fontSize,
            fontWeight: 500,
            lineHeight: '32px',
            textOverflow: 'ellipsis',
          }}
        />
      </Tooltip>
      <IconEdit
        style={{
          position: 'absolute',
          left: width + 10,
          top: 10,
          fontSize: 16,
          color: 'var(--color-text-2)',
          cursor: 'pointer',
        }}
        onClick={() => {
          setIsEditing(true);
          inputRef.current?.focus();
        }}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          width: 'max-content',
          visibility: 'hidden',
          height: 0,
          display: 'block',
          fontSize,
        }}
      >
        {currentValue}
      </span>
    </div>
  );
}
