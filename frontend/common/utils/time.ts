// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { I18n } from '@common/i18n';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

export function formatDatetime(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
) {
  if (!date) {
    return '-';
  }
  const datetime = dayjs(date);
  return datetime.isToday()
    ? `${I18n.t('{placeholder1}', { placeholder1: datetime.format('HH:mm') }, '今日 {placeholder1}')}`
    : datetime.format('YYYY-MM-DD HH:mm');
}

export function formatDatetimeV2(
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  date?: string | number | Date | dayjs.Dayjs | null | undefined,
) {
  if (!date) {
    return '-';
  }
  const datetime = dayjs(date);
  return datetime.format('YYYY-MM-DD HH:mm');
}
