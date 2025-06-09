// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type AxiosResponse } from 'axios';
import { isNumber } from 'lodash';

export class RequestError<T = Record<string, unknown>> extends Error {
  static errorCodeSet = new Set([
    400, 401, 403, 404, 405, 408, 500, 501, 502, 503, 504,
  ]);
  static normalCodeSet = new Set([0, 200, 204, 206]);
  constructor(res: T) {
    super(`RequestError: ${JSON.stringify(res)}`);
  }

  static create(code: string | number, message = '') {
    return new RequestError({ code, message });
  }
  static check(res: AxiosResponse) {
    const { data } = res;
    if (isNumber(data?.code) && !RequestError.normalCodeSet.has(data?.code)) {
      const errorMessage = data?.message ?? res.statusText;
    }
  }
  static is(errorIns: unknown): errorIns is RequestError {
    return errorIns instanceof RequestError;
  }
}
