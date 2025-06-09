// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useMemo } from 'react';

import uploadPopoverXlsx from '@static/img/upload-popover-xlsx.jpg';
import uploadPopoverXlsxShort from '@static/img/upload-popover-xlsx-short.jpg';
import uploadPopoverZip from '@static/img/upload-popover-zip.jpg';
import uploadPopoverZipShort from '@static/img/upload-popover-zip-short.jpg';
import { TemplateFileType } from '@common/constant/creator';

export type Size = 'large' | 'small';

export function useGuideImage(fileType: TemplateFileType, size: Size) {
  return useMemo(() => {
    let img: string;

    if (fileType === 'xlsx') {
      if (size === 'large') {
        img = uploadPopoverXlsx;
      } else {
        img = uploadPopoverXlsxShort;
      }
    } else {
      if (size === 'large') {
        img = uploadPopoverZip;
      } else {
        img = uploadPopoverZipShort;
      }
    }

    return img;
  }, [fileType, size]);
}
