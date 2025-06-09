// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { tea } from '../common/tea';
import { DataPointEnum } from './constant';

/** 批量工具入口曝光 */
export const sendBatchToolsEntranceExpose = () => {
  tea.send(DataPointEnum.BatchToolsEntranceExpose);
};
/** 批量工具活跃UV */
export const sendBatchToolsOpenModal = () => {
  tea.send(DataPointEnum.BatchToolsOpenModal);
};
/** 新建任务UV＆PV */
export const sendBatchToolsCreateTask = () => {
  tea.send(DataPointEnum.BatchToolsCreateTask);
};
/** 提交任务UV＆PV */
export const sendBatchToolsSubmitTask = () => {
  tea.send(DataPointEnum.BatchToolsSubmitTask);
};
/** 窗口最小化UV＆PV */
export const sendBatchToolsWindowMinimize = () => {
  tea.send(DataPointEnum.BatchToolsWindowMinimize);
};
/** 结果下载UV＆PV */
export const sendBatchToolsDownloadResult = () => {
  tea.send(DataPointEnum.BatchToolsDownloadResult);
};
/** 结果预览点击UV＆PV */
export const sendBatchToolsPreviewResult = () => {
  tea.send(DataPointEnum.BatchToolsPreviewResult);
};
/** 结果复制UV＆PV */
export const sendBatchToolsCopyParams = () => {
  tea.send(DataPointEnum.BatchToolsCopyParams);
};
/** 取消任务UV & PV */
export const sendBatchToolsCancelTask = () => {
  tea.send(DataPointEnum.BatchToolsCancelTask);
};
