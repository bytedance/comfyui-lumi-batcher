// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import uploadPopoverXlsx from '@static/img/upload-popover-xlsx.jpg';
import uploadPopoverXlsxShort from '@static/img/upload-popover-xlsx-short.jpg';
import uploadPopoverZip from '@static/img/upload-popover-zip.jpg';
import uploadPopoverZipShort from '@static/img/upload-popover-zip-short.jpg';
import uploadPopoverXlsxEn from '@static/img/upload-popover-xlsx-en.png';
import uploadPopoverZipEn from '@static/img/upload-popover-zip-en.png';
import uploadPopoverXlsxShortEn from '@static/img/upload-popover-xlsx-short-en.png';
import uploadPopoverZipShortEn from '@static/img/upload-popover-zip-short-en.png';
import { TemplateFileType } from '@common/constant/creator';
import { LanguagesEnum, languageUtils } from '@common/language';

export type Size = 'large' | 'small';

export function useGuideImage(fileType: TemplateFileType, size: Size) {
  const language = languageUtils.getLanguage();
  const largeXlsx =
    language === LanguagesEnum.EN ? uploadPopoverXlsxEn : uploadPopoverXlsx;
  const largeZip =
    language === LanguagesEnum.EN ? uploadPopoverZipEn : uploadPopoverZip;
  const smallXlsx =
    language === LanguagesEnum.EN
      ? uploadPopoverXlsxShortEn
      : uploadPopoverXlsxShort;
  const smallZip =
    language === LanguagesEnum.EN
      ? uploadPopoverZipShortEn
      : uploadPopoverZipShort;
  return useMemo(() => {
    let img: string;

    if (fileType === 'xlsx') {
      if (size === 'large') {
        img = largeXlsx;
      } else {
        img = smallXlsx;
      }
    } else {
      if (size === 'large') {
        img = largeZip;
      } else {
        img = smallZip;
      }
    }

    return img;
  }, [fileType, size]);
}
