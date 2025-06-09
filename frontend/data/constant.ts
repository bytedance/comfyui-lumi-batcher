// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
/** 埋点枚举 */
export enum DataPointEnum {
  /** 批量工具入口曝光 */
  BatchToolsEntranceExpose = 'batch_tools_entrance_expose',
  /** 批量工具活跃UV */
  BatchToolsOpenModal = 'batch_tools_open_modal',
  /** 新建任务UV＆PV */
  BatchToolsCreateTask = 'batch_tools_create_task',
  /** 提交任务UV＆PV */
  BatchToolsSubmitTask = 'batch_tools_submit_task',
  /** 窗口最小化UV＆PV */
  BatchToolsWindowMinimize = 'batch_tools_window_minimize',
  /** 结果下载UV＆PV */
  BatchToolsDownloadResult = 'batch_tools_download_result',
  /** 结果预览点击UV＆PV */
  BatchToolsPreviewResult = 'batch_tools_preview_result',
  /** 结果复制UV＆PV */
  BatchToolsCopyParams = 'batch_tools_copy_params',
  /** 取消任务UV & PV */
  BatchToolsCancelTask = 'batch_tools_cancel_task',
}
