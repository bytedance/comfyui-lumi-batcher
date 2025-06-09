// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Button, Message } from '@arco-design/web-react';

import { type Size, useGuideImage } from './shared';

import './index.scss';
import Flex from '@common/components/Flex';
import {
  TemplateFileHrefMap,
  TemplateFileNameMap,
  TemplateFileType,
} from '@common/constant/creator';
import { I18n } from '@common/i18n';

interface UploadPopoverProps {
  width: number;
  fileType: TemplateFileType;
  size: Size;
}

export default function UploadPopover({
  width,
  fileType,
  size,
}: UploadPopoverProps) {
  const img = useGuideImage(fileType, size);

  const onDownload = async () => {
    Message.success(I18n.t('template_downloaded', {}, '模板已下载'));

    const filename = TemplateFileNameMap[fileType];

    const href = TemplateFileHrefMap[fileType];

    try {
      const res = await (
        await fetch(href).then((response) => {
          if (response.status !== 200) {
            return Promise.reject(
              new Error(I18n.t('template_download_failed', {}, '模板下载失败')),
            );
          }
          return response;
        })
      ).blob();
      const url = window.URL.createObjectURL(res);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      Message.error(I18n.t('download_failed', {}, '下载失败'));
    }
  };

  return (
    <Flex
      className="upload-popover-content"
      style={{
        width,
      }}
      direction="column"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Flex
        className="upload-popover-content-header"
        justify="space-between"
        align="center"
      >
        <div className="upload-popover-content-header-title">
          {I18n.t('newbie_help', {}, '新手帮助')}
        </div>
      </Flex>

      <Flex className="upload-popover-content-info" direction="column" gap={16}>
        <Flex direction={size === 'large' ? 'row' : 'column'} gap={16}>
          <img
            className="upload-popover-content-info-img"
            style={{
              width: size === 'large' ? '50%' : '100%',
            }}
            alt={I18n.t('guide_image_alt', {}, '引导图片')}
            src={img}
          />
          <div className="upload-popover-content-info-tips">
            {I18n.t(
              'export_the_file_template__fill_in_the_information__and_upload_it_to_complete_the',
              {},
              '导出文件模版，填写信息后，上传即可完成解析～',
            )}
          </div>
        </Flex>
        <Flex justify="end">
          <Button type="primary" onClick={onDownload}>
            {I18n.t(
              'download_the_{filetype}_template',
              { fileType },
              '下载{fileType}模板',
            )}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
