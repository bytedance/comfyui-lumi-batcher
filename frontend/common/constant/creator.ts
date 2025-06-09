// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '../language';

export const ParamsTypeLabelMap: Record<string, string> = {
  data: languageUtils.getText(TranslateKeys.SINGLE_PARAM_TYPE),
  group: languageUtils.getText(TranslateKeys.GROUP_PARAM_TYPE),
};

export enum ParamsListDisplayMode {
  TABLE = 'table',
  CARDS = 'cards',
}

export const newGuideHelpLink =
  'https://bytedance.larkoffice.com/docx/LGLWdPIj8ooQyxxMAOQcWmR8nCh';

export enum ColumnTypeEnum {
  /** 文本 */
  Text = 'text',
  /** 图片 */
  Image = 'image',
  /** 视频 */
  Video = 'video',
  /** 数字 */
  Number = 'number',
}

export const ColumnTypeEnumLabel: Record<ColumnTypeEnum, string> = {
  [ColumnTypeEnum.Text]: I18n.t('text', {}, '文本'),
  [ColumnTypeEnum.Image]: I18n.t('picture', {}, '图片'),
  [ColumnTypeEnum.Video]: I18n.t('video', {}, '视频'),
  [ColumnTypeEnum.Number]: I18n.t('number', {}, '数字'),
};

export const TemplateXlsxLink =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupaonpmeh7nuhpeuhpa/batch-tools-sdk/data-param-value-demo.xlsx';
export const TemplateZipLink =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupaonpmeh7nuhpeuhpa/batch-tools-sdk/image-param-value-demo.zip';
export const TemplateXlsxGroupLink =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupaonpmeh7nuhpeuhpa/batch-tools-sdk/group-param-value-demo.xlsx';
export const TemplateZipVideoLink =
  'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupaonpmeh7nuhpeuhpa/batch-tools-sdk/video-param-value-demo.zip';

export type TemplateFileType =
  | 'xlsx'
  | 'zip_image'
  | 'zip_video'
  | 'xlsx_group';

export const TemplateFileNameMap: Record<TemplateFileType, string> = {
  xlsx: 'demo-params.xlsx',
  xlsx_group: 'demo-params-group.xlsx',
  zip_image: 'demo-params-image.zip',
  zip_video: 'demo-params-video.zip',
};

export const TemplateFileHrefMap: Record<TemplateFileType, string> = {
  xlsx: TemplateXlsxLink,
  zip_image: TemplateZipLink,
  xlsx_group: TemplateXlsxGroupLink,
  zip_video: TemplateZipVideoLink,
};
