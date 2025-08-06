// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Input,
  type InputProps,
  Select,
  Space,
  Typography,
} from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import { ClearComponent } from './ClearComp';
import { CustomTag } from './CustomTag';
import { RandomSeed } from './RandomSeed';
import { dataTransfer } from './share';
import { UploadComponent } from './UploadComp';
import type { Size } from './UploadPopover/shared';

import './index.scss';
import {
  getNodeInfo,
  getNodeInfoKey,
  NodeInfo,
  ValueBaseType,
} from '@src/create-task/utils/get-node-info';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { useCreatorStore } from '@src/create-task/store';
import {
  buildSpecialOutputValue,
  RE_IMAGE_SUFFIX,
  RE_VIDEO_SUFFIX,
  ValueTypeEnum,
} from '@common/utils/value-type';
import { TemplateFileType } from '@common/constant/creator';
import { SpecialOutputSuffix } from '@common/constant/params-config';
import { uuid } from '@common/utils/uuid';

interface InputParamsValueProps {
  onChange: (value: ValueBaseType[]) => void;
  defaultValue?: string;
  placeholder?: string;
  autoFocus?: boolean;
  noSplit?: boolean;
  popover?: {
    type: TemplateFileType;
    size: Size;
  };
  currentParamConfig: ParamsConfigTypeItem;
  enterFrom?: 'batch-input' | 'single-input';
  size?: InputProps['size'];
}

export const InputParamsValue: React.FC<InputParamsValueProps> = (props) => {
  const {
    onChange,
    placeholder = '',
    autoFocus,
    defaultValue = '',
    noSplit,
    popover,
    currentParamConfig,
    size = 'large',
    enterFrom = 'batch-input',
  } = props;
  const [currentNodeInfoMap, updateCurrentNodeInfoMap] = useCreatorStore(
    useShallow((s) => [s.currentNodeInfoMap, s.updateCurrentNodeInfoMap]),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState<string | string[]>(defaultValue);
  const [inputValue, setInputValue] = useState<string | string[]>('');
  const [popupVisible, setPopupVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);

  const nodeInfo = currentParamConfig?.nodeId
    ? currentNodeInfoMap[getNodeInfoKey(currentParamConfig)]
    : ({} as NodeInfo);

  const matchSelector = nodeInfo?.paramOptions?.length > 0;

  useEffect(() => {
    if (!currentParamConfig.nodeId) {
      return;
    }

    const n = getNodeInfo(
      currentParamConfig.nodeId,
      currentParamConfig.internal_name,
    );

    updateCurrentNodeInfoMap(n.key, n);
  }, [currentParamConfig]);

  const handleChange = (newValue?: any) => {
    const lastValue = newValue || value;
    if (isEditing) {
      return;
    }
    if (lastValue instanceof Array) {
      onChange(dataTransfer(lastValue, nodeInfo?.paramType));
      setValue('');
      return;
    }

    if (noSplit) {
      onChange(dataTransfer(lastValue, nodeInfo?.paramType));
    } else {
      if (lastValue) {
        if (/[;；]/.test(lastValue)) {
          onChange(dataTransfer(lastValue.split(/[;；]/), nodeInfo?.paramType));
        } else {
          onChange(dataTransfer(lastValue, nodeInfo?.paramType));
        }
      }

      setValue('');
    }
  };

  const onPressEnter = () => {
    handleChange();
  };

  const onBlur = () => {
    setPopupVisible(false);
    handleChange();
  };

  const handlePlaceholderClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (autoFocus) {
      handlePlaceholderClick();
    }
  }, []);

  const SuffixComp = useMemo(
    () => (
      <Space size="small" style={{ zIndex: 2 }}>
        <ClearComponent
          onClick={() => {
            setValue('');
          }}
        />
        <UploadComponent
          currentParamConfig={currentParamConfig}
          rootDomRef={rootRef}
          popover={popover}
          isUploading={isEditing}
          onUpdateUploadingStatus={setIsEditing}
          onChange={onChange}
          onVisibleChange={(v) => setPopupVisible(!v)}
        />
      </Space>
    ),
    [
      currentParamConfig,
      rootRef,
      popover,
      isEditing,
      setIsEditing,
      setValue,
      onChange,
    ],
  );

  // 增加类型过滤，图片、视频需要过滤候选值列表数据
  const options = useMemo(
    () =>
      (nodeInfo?.paramOptions || []).filter((v) => {
        if (nodeInfo.paramType === ValueTypeEnum.IMAGE) {
          return RE_IMAGE_SUFFIX.test(String(v).toLowerCase());
        } else if (nodeInfo.paramType === ValueTypeEnum.VIDEO) {
          return RE_VIDEO_SUFFIX.test(String(v).toLowerCase());
        } else {
          return true;
        }
      }),
    [nodeInfo],
  );

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative' }}
      className="input-param-value-wrapper"
    >
      {matchSelector ? (
        <Select
          className="input-param-value-select"
          ref={inputRef}
          size={size}
          mode={enterFrom === 'batch-input' ? 'multiple' : undefined}
          defaultValue={defaultValue}
          value={value ? (value instanceof Array ? value : [value]) : []}
          onChange={(v) => {
            setValue(v);
            if (enterFrom === 'single-input') {
              handleChange(v);
            }
          }}
          onInputValueChange={setInputValue}
          popupVisible={popupVisible}
          allowCreate={{
            formatter: (input_value) => ({
              value: input_value,
              label: input_value,
            }),
          }}
          renderTag={({ label, closable, onClose }, index, valueList) => (
            <CustomTag
              props={{
                label,
                closable,
                onClose,
              }}
              rootRef={rootRef}
              index={index}
              values={valueList}
              internal_name={currentParamConfig.internal_name ?? ''}
            />
          )}
          renderFormat={(option, val) => {
            if (enterFrom === 'single-input') {
              return (
                <Typography.Paragraph
                  className="clear-arco-typography-margin-bottom"
                  ellipsis={{
                    rows: 1,
                    showTooltip: true,
                    wrapper: 'div',
                  }}
                >
                  {typeof val === 'string' ? val : String(val)}
                </Typography.Paragraph>
              );
            } else {
              return val as string;
            }
          }}
          getPopupContainer={() =>
            enterFrom === 'batch-input'
              ? rootRef.current || document.body
              : document.body
          }
          suffixIcon={SuffixComp}
          onFocus={() => {
            setIsEditing(false);
            setPopupVisible(true);
          }}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.keyCode === 13 || e.code === 'Enter') {
              if (!inputValue) {
                inputRef.current?.blur();
                e.preventDefault();
              }
            }
          }}
        >
          {options.map((option) => {
            const v = String(option || '');
            return (
              <Select.Option
                key={uuid()}
                value={
                  String(nodeInfo?.paramValue)?.endsWith(SpecialOutputSuffix)
                    ? buildSpecialOutputValue(v)
                    : v
                }
              >
                {option}
              </Select.Option>
            );
          })}
        </Select>
      ) : (
        <Input
          className="input-param-value-input"
          ref={inputRef}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          size={size}
          placeholder=""
          onPressEnter={onPressEnter}
          value={value as string}
          onBlur={onBlur}
          onFocus={() => setIsEditing(false)}
          onChange={(v) => {
            setValue(v);
          }}
          suffix={SuffixComp}
        />
      )}

      {value?.length === 0 && inputValue?.length === 0 && (
        <div className="custom-placeholder">
          <Typography.Paragraph
            onClick={handlePlaceholderClick}
            className="clear-arco-typography-margin-bottom placeholder-text"
            ellipsis={{
              rows: 1,
              showTooltip: true,
              wrapper: 'div',
            }}
          >
            {placeholder}
          </Typography.Paragraph>
          {nodeInfo?.isSeed && enterFrom === 'batch-input' ? (
            <RandomSeed
              onChange={onChange}
              inputDomRef={inputRef}
              rootDomRef={rootRef}
              config={currentParamConfig}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
