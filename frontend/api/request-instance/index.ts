// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { RequestError } from '@common/error/request-error';
import axios from 'axios';

const requestClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

requestClient.interceptors.response.use(
  (response) => {
    RequestError.check(response);
    return response;
  },
  (e) => {
    if (e.request.status === 400 && e.request._url === '/prompt') {
      throw new Error(
        e.response.data ? JSON.stringify(e.response.data) : e.message,
      );
    }
    throw new RequestError(e.message);
  },
);
export default requestClient;

export const apiPrefix = '/api/comfyui-lumi-batcher';
