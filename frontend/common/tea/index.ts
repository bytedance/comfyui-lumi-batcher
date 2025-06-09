// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { IInitParam, Collector } from '@datarangers/sdk-javascript';
import { isNil } from 'lodash';

type TeaConfig = {
  appId: number;
  appName: string;
  channel: IInitParam['channel'] | 'in' | 'ie' | 'ie2';
};
const regionMap: Record<string, TeaConfig> = {
  cn: {
    appId: 773786,
    channel: 'cn',
    appName: 'ComfyUI-Lumi-Batcher',
  },
};

const getTeaConfig = (): TeaConfig => {
  const teaConfig = regionMap['cn'];
  if (isNil(teaConfig)) {
    throw new Error(`Failed to get tea config with unknown region = ${'cn'}`);
  }
  return teaConfig;
};

const teaConfig: TeaConfig = getTeaConfig();

class Tea {
  _instance = new Collector(teaConfig.appName);
  _uid = '';

  constructor() {
    this._instance.init({
      app_id: teaConfig.appId,
      channel: teaConfig.channel as IInitParam['channel'],
    });
    this._instance.start();
  }

  config(uid: string) {
    this._uid = uid;
    this._instance.config({
      user_unique_id: uid,
      _staging_flag: 0,
    });
  }

  configParams(params: { [key: string]: string }) {
    this._instance.config({
      ...params,
    });
  }

  /** 埋点上报 */
  send(eventType: string, params: Record<string, any> = {}) {
    this._instance.event(eventType, params);
  }
}

export const tea = new Tea();
