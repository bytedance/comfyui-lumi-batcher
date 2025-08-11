// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';

import { Message, Trigger, Upload } from '@arco-design/web-react';
import { type UploadItem } from '@arco-design/web-react/es/Upload';
import { useShallow } from 'zustand/react/shallow';

import { ReactComponent as FileUploadIcon } from '@static/icons/file-upload-icon.svg';
import { ReactComponent as IconLoading } from '@static/icons/icon-loading.svg';

import UploadPopover from '../UploadPopover';
import type { Size } from '../UploadPopover/shared';

import './index.scss';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { useCreatorStore } from '@src/create-task/store';
import { getNodeInfoKey } from '@src/create-task/utils/get-node-info';
import { resolveFile } from '@api/resolve-file';
import { I18n } from '@common/i18n';
import { ValueTypeEnum } from '@common/utils/value-type';
import { TemplateFileType } from '@common/constant/creator';

interface PropsType {
  popover?: {
    type: TemplateFileType;
    size: Size;
  };
  isUploading: boolean;
  rootDomRef: React.RefObject<HTMLDivElement>;
  currentParamConfig: ParamsConfigTypeItem;
  onUpdateUploadingStatus: (status: boolean) => void;
  onChange: (res: string[]) => void;
  onVisibleChange: (status: boolean) => void;
}

export const UploadComponent: React.FC<PropsType> = ({
  popover,
  rootDomRef,
  // isUploading,
  currentParamConfig,
  onUpdateUploadingStatus,
  onChange,
  onVisibleChange,
}) => {
  const [currentNodeInfoMap] = useCreatorStore(
    useShallow((s) => [s.currentNodeInfoMap]),
  );
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [fileList, setFileList] = useState<UploadItem[]>([]);
  const [fileOutputMap, setFileOutputMap] = useState<
    Map<string | undefined, string[]>
  >(new Map());
  const [fileUploadError, setFileUploadError] = useState<
    (string | undefined)[]
  >([]);

  const accept = currentParamConfig.nodeId
    ? currentNodeInfoMap[getNodeInfoKey(currentParamConfig)]?.uploadAccept
    : '';
  const type = currentParamConfig.nodeId
    ? currentNodeInfoMap[getNodeInfoKey(currentParamConfig)]?.paramType
    : '';

  const updateRect = (v: boolean) => {
    setRect(rootDomRef.current?.getBoundingClientRect() || null);
    onVisibleChange(v);
  };

  // 自定义上传改造
  const customRequestHandler = async (option: any) => {
    const { file: currentFile } = option;
    const file_extension = `.${currentFile.name.split('.').pop()}`;
    try {
      const data = new FormData();
      data.append('file', currentFile);
      data.append('file_extension', file_extension);
      const res = await resolveFile(data);
      // 解析文件无结果记录
      if (res.data.length === 0) {
        setFileUploadError((e) => [...e, currentFile.name]);
      }
      setFileOutputMap((m) => {
        m.set(currentFile.name, res.data);

        return m;
      });
    } catch (error) {
      setFileUploadError((e) => [...e, currentFile.name]);
      console.error(error);
    } finally {
      // 更新文件上传进度状态，成功 | 失败 --> 100
      setFileList((files) =>
        files.map((i) => {
          if (i.originFile?.name === currentFile.name) {
            i.percent = 100;
          }
          return i;
        }),
      );
    }
  };

  const resetUploadInfo = () => {
    setFileList([]);
    setFileOutputMap(new Map());
    setFileUploadError([]);
  };

  const isUploadComplete = useMemo(
    () => !fileList.every((f) => f.percent === 100),
    [fileList],
  );

  useEffect(() => {
    if (!isUploadComplete && fileList.length) {
      const result: string[] = [];

      fileList.forEach((f) => {
        const tempArr = fileOutputMap.get(f.originFile?.name) ?? [];
        if (
          type &&
          [ValueTypeEnum.IMAGE, ValueTypeEnum.VIDEO].includes(type) &&
          accept
        ) {
          result.push(
            ...tempArr.filter((i) =>
              accept.includes((i.split('.').pop() || '').toLowerCase()),
            ),
          );
        } else {
          result.push(...tempArr);
        }
      });
      if (
        fileList.every((f) => fileUploadError.includes(f.originFile?.name)) ||
        result.length === 0
      ) {
        Message.error(
          I18n.t(
            'file_parsing_failed__please_check_the_file~',
            {},
            '文件解析失败，请检查文件～',
          ),
        );
      } else if (
        fileList.some((f) => fileUploadError.includes(f.originFile?.name)) &&
        result.length > 0
      ) {
        Message.error(
          I18n.t(
            'some_files_were_parsed_successfully__please_check_the_files~',
            {},
            '部分文件解析成功，请检查文件~',
          ),
        );
      } else {
        Message.success(
          I18n.t(
            'the_parameters_have_been_successfully_uploaded_and_parsed__the_details_are_as_follow',
            {},
            '参数已成功上传并解析，详情如下表～',
          ),
        );
      }

      onUpdateUploadingStatus(false);

      onChange(result);

      resetUploadInfo();
    }
  }, [fileList, isUploadComplete, fileOutputMap, fileUploadError]);

  const uploadComp = (
    <Upload
      accept={accept ?? ''}
      // fileList={fileList ? fileList : currentFileList}
      showUploadList={false}
      fileList={fileList}
      multiple
      customRequest={customRequestHandler}
      onChange={setFileList}
    >
      <FileUploadIcon
        style={{
          cursor: 'pointer',
          verticalAlign: 'middle',
        }}
        onClick={() => {
          onUpdateUploadingStatus(true);
        }}
      />
    </Upload>
  );

  const triggerComp = popover ? (
    <Trigger
      className="upload-trigger-left-0"
      position="bottom"
      onVisibleChange={updateRect}
      alignPoint={false}
      popupAlign={{
        bottom: [0, 8],
      }}
      popup={() =>
        popover ? (
          <UploadPopover
            width={rect?.width || 0}
            fileType={popover.type}
            size={popover.size}
          />
        ) : null
      }
      getPopupContainer={() =>
        rootDomRef.current as NonNullable<HTMLDivElement>
      }
    >
      {uploadComp}
    </Trigger>
  ) : (
    uploadComp
  );
  return (
    <>
      {isUploadComplete ? (
        <IconLoading className="icon-loading-rotate" />
      ) : (
        triggerComp
      )}
    </>
  );
};
