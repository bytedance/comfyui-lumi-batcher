// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
// starling-disable-file
import { TranslateKeys } from './key';

export enum LanguagesEnum {
  ZH = 'zh-CN',
  EN = 'en-US',
}
/**
 * 语言展示文案
 */
export const languageDisplayText: Record<LanguagesEnum, string> = {
  [LanguagesEnum.ZH]: '简体中文',
  [LanguagesEnum.EN]: 'English',
};

/**
 * 语言映射，根据key取对应的文案
 */
export const languageConfigMap: Record<
  TranslateKeys,
  {
    [k in LanguagesEnum]: string;
  }
> = {
  [TranslateKeys.TASK_LIST_TITLE]: {
    [LanguagesEnum.ZH]: '批量任务列表',
    [LanguagesEnum.EN]: 'Task List',
  },
  [TranslateKeys.TASK_LIST_SEARCH_PLACEHOLDER]: {
    [LanguagesEnum.ZH]: '请输入任务名称',
    [LanguagesEnum.EN]: 'Please enter the task name',
  },
  [TranslateKeys.NEW_GUIDER_HELP]: {
    [LanguagesEnum.ZH]: '新手帮助',
    [LanguagesEnum.EN]: 'Assistance for Beginners',
  },
  [TranslateKeys.CREATE_BATCH_TASK]: {
    [LanguagesEnum.ZH]: '新建批量任务',
    [LanguagesEnum.EN]: 'New Task',
  },
  [TranslateKeys.WINDOW_MINIMIZE]: {
    [LanguagesEnum.ZH]: '窗口最小化',
    [LanguagesEnum.EN]: 'Minimize',
  },
  [TranslateKeys.DOWNLOAD]: {
    [LanguagesEnum.ZH]: '下载',
    [LanguagesEnum.EN]: 'Download',
  },
  [TranslateKeys.DOWNLOAD_ONLY_PICTURE]: {
    [LanguagesEnum.ZH]: '仅下载图（快）',
    [LanguagesEnum.EN]: 'Download the pictures',
  },
  [TranslateKeys.DOWNLOAD_ALL_FILES]: {
    [LanguagesEnum.ZH]: '下载图和全部文件（慢）',
    [LanguagesEnum.EN]: 'Download the pictures and files',
  },
  [TranslateKeys.DOWNLOAD_END]: {
    [LanguagesEnum.ZH]: '开始下载批量任务结果',
    [LanguagesEnum.EN]: 'Start downloading batch task results',
  },
  [TranslateKeys.RESULT_DIFF_CHECK]: {
    [LanguagesEnum.ZH]: '结果对比',
    [LanguagesEnum.EN]: 'Preview of Results',
  },
  [TranslateKeys.COPY_PARAMS]: {
    [LanguagesEnum.ZH]: '复制参数',
    [LanguagesEnum.EN]: 'copy',
  },
  [TranslateKeys.CANCEL_TASK]: {
    [LanguagesEnum.ZH]: '取消任务',
    [LanguagesEnum.EN]: 'cancel',
  },
  [TranslateKeys.BATCH_TASK_TITLE]: {
    [LanguagesEnum.ZH]: '新建任务，为任务取个名字吧',
    [LanguagesEnum.EN]: 'Create a new task and give it a name',
  },
  [TranslateKeys.PARAM_VALUES_COUNT_UNIT]: {
    [LanguagesEnum.ZH]: '份',
    [LanguagesEnum.EN]: 'portion',
  },
  [TranslateKeys.FINAL_RESULT_COUNT]: {
    [LanguagesEnum.ZH]: '最终生成数量',
    [LanguagesEnum.EN]: 'Quality of the final result',
  },
  [TranslateKeys.PARAMS_NAME]: {
    [LanguagesEnum.ZH]: '参数',
    [LanguagesEnum.EN]: 'parameters',
  },
  [TranslateKeys.PARAM_NAME]: {
    [LanguagesEnum.ZH]: '参数',
    [LanguagesEnum.EN]: 'parameter',
  },
  [TranslateKeys.PARAM_LIST]: {
    [LanguagesEnum.ZH]: '参数列表',
    [LanguagesEnum.EN]: 'Parameter list',
  },
  [TranslateKeys.PARAMS_COUNT]: {
    [LanguagesEnum.ZH]: '参数个数',
    [LanguagesEnum.EN]: 'The number of parameters',
  },
  [TranslateKeys.PARAMS_COPIES]: {
    [LanguagesEnum.ZH]: '参数份数',
    [LanguagesEnum.EN]: 'The number of parameter copies',
  },
  [TranslateKeys.CONTAIN_PARAMS]: {
    [LanguagesEnum.ZH]: '内含参数',
    [LanguagesEnum.EN]: 'Contained parameters',
  },
  [TranslateKeys.SELECT_NODE_PLACEHOLDER]: {
    [LanguagesEnum.ZH]: '请选择或模糊搜索',
    [LanguagesEnum.EN]: 'Please select or search',
  },
  [TranslateKeys.BATCH_ADD_VALUES_PLACEHOLDER]: {
    [LanguagesEnum.ZH]: '数值，可通过“；”批量添加，enter回车键确定提交',
    [LanguagesEnum.EN]:
      '，You can complete batch addition through ; and complete the input by pressing Enter.',
  },
  [TranslateKeys.BATCH_ADD_VALUES_PLACEHOLDER_SIMPLE]: {
    [LanguagesEnum.ZH]: '值，enter键提交',
    [LanguagesEnum.EN]: '，You can complete the input by pressing Enter.',
  },
  [TranslateKeys.ADD_PARAM]: {
    [LanguagesEnum.ZH]: '参数值',
    [LanguagesEnum.EN]: 'parameter',
  },
  [TranslateKeys.SINGLE_PARAM_TEXT]: {
    [LanguagesEnum.ZH]: '参数(不捆绑)',
    [LanguagesEnum.EN]: 'parameter',
  },
  [TranslateKeys.GROUP_PARAM_TEXT]: {
    [LanguagesEnum.ZH]: '组合参数(捆绑)',
    [LanguagesEnum.EN]: 'parameter（pair/multivariate tuple）',
  },
  [TranslateKeys.SAVE_PARAM_CONFIG]: {
    [LanguagesEnum.ZH]: '完成',
    [LanguagesEnum.EN]: 'Complete',
  },
  [TranslateKeys.SAVE_PARAM_CONFIG_CONTINUE]: {
    [LanguagesEnum.ZH]: '完成后继续',
    [LanguagesEnum.EN]: 'Add More Parameters',
  },
  [TranslateKeys.SUBMIT_CREATE_BATCH_TASK]: {
    [LanguagesEnum.ZH]: '提交任务',
    [LanguagesEnum.EN]: 'Submit the task',
  },
  [TranslateKeys.SPENT_LONG_TIME_TEXT]: {
    [LanguagesEnum.ZH]: '这个过程可能耗时较长，请耐心等待',
    [LanguagesEnum.EN]: 'This may take a while',
  },
  [TranslateKeys.GROUP_PARAM_TYPE]: {
    [LanguagesEnum.ZH]: '组合参数',
    [LanguagesEnum.EN]: 'Parameter（pair/multivariate tuple）',
  },
  [TranslateKeys.SINGLE_PARAM_TYPE]: {
    [LanguagesEnum.ZH]: '单参数',
    [LanguagesEnum.EN]: 'Parameter',
  },
  [TranslateKeys.SHARE]: {
    [LanguagesEnum.ZH]: '分享',
    [LanguagesEnum.EN]: 'share',
  },
  [TranslateKeys.RESULT_SHARE]: {
    [LanguagesEnum.ZH]: '结果分享',
    [LanguagesEnum.EN]: 'share',
  },
  [TranslateKeys.SHARE_LINK_COPIED]: {
    [LanguagesEnum.ZH]: '已复制分享链接',
    [LanguagesEnum.EN]: 'Share link copied',
  },
  [TranslateKeys.SHARE_ID_UNKNOW]: {
    [LanguagesEnum.ZH]: '链接中未包含分享 id',
    [LanguagesEnum.EN]: 'The link does not contain a share id',
  },
  [TranslateKeys.TABLE_CONFIG_BOARD]: {
    [LanguagesEnum.ZH]: '表格配置面板',
    [LanguagesEnum.EN]: 'Table configuration panel',
  },
  [TranslateKeys.TABLE_CONFIG_GROUP]: {
    [LanguagesEnum.ZH]: '按以下参数聚合',
    [LanguagesEnum.EN]: 'Aggregate by the following parameters',
  },
  [TranslateKeys.X_AXIS]: {
    [LanguagesEnum.ZH]: '横轴',
    [LanguagesEnum.EN]: 'X-axis',
  },
  [TranslateKeys.Y_AXIS]: {
    [LanguagesEnum.ZH]: '纵轴',
    [LanguagesEnum.EN]: 'Y-axis',
  },
  [TranslateKeys.SELECT_PARAM_PLACEHOLDER]: {
    [LanguagesEnum.ZH]: '请选择参数',
    [LanguagesEnum.EN]: 'Select parameters',
  },
  [TranslateKeys.STATUS_SUCCEED]: {
    [LanguagesEnum.ZH]: '成功',
    [LanguagesEnum.EN]: 'Succeed',
  },
  [TranslateKeys.STATUS_COMPLETED]: {
    [LanguagesEnum.ZH]: '推理完成',
    [LanguagesEnum.EN]: 'Completed',
  },
  [TranslateKeys.STATUS_FAILED]: {
    [LanguagesEnum.ZH]: '失败',
    [LanguagesEnum.EN]: 'Failed',
  },
  [TranslateKeys.STATUS_CANCELLED]: {
    [LanguagesEnum.ZH]: '已取消',
    [LanguagesEnum.EN]: 'Cancelled',
  },
  [TranslateKeys.STATUS_PARTIAL_SUCCEED]: {
    [LanguagesEnum.ZH]: '部分成功',
    [LanguagesEnum.EN]: 'Partially Succeed',
  },
  [TranslateKeys.STATUS_RUNNING]: {
    [LanguagesEnum.ZH]: '生成中',
    [LanguagesEnum.EN]: 'Running',
  },
  [TranslateKeys.STATUS_CREATING]: {
    [LanguagesEnum.ZH]: '创建中',
    [LanguagesEnum.EN]: 'Creating',
  },
  [TranslateKeys.STATUS_WAITING]: {
    [LanguagesEnum.ZH]: '排队中',
    [LanguagesEnum.EN]: 'Waiting',
  },
  [TranslateKeys.STATUS_DIRTY]: {
    [LanguagesEnum.ZH]: '已失效',
    [LanguagesEnum.EN]: 'Dirty',
  },

  [TranslateKeys.RESET]: {
    [LanguagesEnum.ZH]: '重置',
    [LanguagesEnum.EN]: 'Reset',
  },
  [TranslateKeys.CONFIRM]: {
    [LanguagesEnum.ZH]: '确定',
    [LanguagesEnum.EN]: 'Confirm',
  },
  [TranslateKeys.EXIT]: {
    [LanguagesEnum.ZH]: '退出',
    [LanguagesEnum.EN]: 'Exit',
  },
  [TranslateKeys.DELETE]: {
    [LanguagesEnum.ZH]: '删除',
    [LanguagesEnum.EN]: 'Delete',
  },
  [TranslateKeys.EDIT]: {
    [LanguagesEnum.ZH]: '编辑',
    [LanguagesEnum.EN]: 'Edit',
  },
  [TranslateKeys.CREATE_DATASET]: {
    [LanguagesEnum.ZH]: '新建数据集',
    [LanguagesEnum.EN]: 'Create Dataset',
  },
  [TranslateKeys.DATASET_LIST_SEARCH_PLACEHOLDER]: {
    [LanguagesEnum.ZH]: '请输入数据集名称',
    [LanguagesEnum.EN]: 'Please enter the dataset name',
  },
};
