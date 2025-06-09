// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { ResultOutputTypeEnum } from '@api/result';
import { RE_IMAGE_SUFFIX, RE_VIDEO_SUFFIX } from '@common/utils/value-type';

export const getResourceType = (value: string) => {
  if (RE_IMAGE_SUFFIX.test(String(value).toLowerCase())) {
    return ResultOutputTypeEnum.Image;
  } else if (RE_VIDEO_SUFFIX.test(String(value).toLowerCase())) {
    return ResultOutputTypeEnum.Video;
  } else {
    return ResultOutputTypeEnum.Text;
  }
};
