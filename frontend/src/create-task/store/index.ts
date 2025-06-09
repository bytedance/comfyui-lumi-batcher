// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { type FormInstance } from '@arco-design/web-react';
import { create } from 'zustand';

import { type NodeInfo } from '../utils/get-node-info';
import { ParamsListDisplayMode } from '@common/constant/creator';
import { languageUtils, TranslateKeys } from '@common/language';
import {
  ParamsConfigTypeItem,
  AllNodesOptions,
  ParamsConfigType,
} from '@common/type/batch-task';
import { openParamsConfigModal } from '@src/params-config';
import { uuid } from '@common/utils/uuid';
import { I18n } from '@common/i18n';
import _ from 'lodash';

/** 可重置的 key */
type ResetParamNames = ('taskName' | 'paramsConfig')[];

interface StateType {
  taskName: string;
  /** 参数配置弹窗关闭方法 */
  // eslint-disable-next-line @typescript-eslint/ban-types
  closeParamsModal?: Function;
  currentParamsConfig: ParamsConfigTypeItem;
  allNodesOptions: AllNodesOptions;
  paramsConfig: ParamsConfigType;
  paramsListDisplayMode: ParamsListDisplayMode;
  paramsEditMode: 'edit' | 'create';
  editIndex: number;
  reset: (names?: ResetParamNames) => void;
  /** 更新当前参数配置 */
  updateCurrentConfig: (obj: Partial<ParamsConfigTypeItem>) => void;
  /** 新增参数配置 */
  addParamsConfig: () => void;
  /** 编辑参数配置 */
  updateParamsConfig: (obj: ParamsConfigTypeItem, editIndex?: number) => void;
  /** 删除参数配置 */
  deleteParamsConfig: (index: number) => void;
  /** 复制参数配置 */
  copy: (info: {
    taskName: StateType['taskName'];
    paramsConfig: StateType['paramsConfig'];
  }) => void;
  /** 内置方法：用于更新当前节点的配置信息映射 */
  updateCurrentNodeInfoMap: (key: string | number, nodeInfo: NodeInfo) => void;
  /** 批量添加批量协议 */
  batchAddParamsConfig: (configList: ParamsConfigType) => void;
  /** 批量更新批量协议 */
  batchUpdateParamsConfig: (configList: ParamsConfigType) => void;
  /** 用于描述工作流检测时新建任务loading */
  checkWorkflowLoading: boolean;
  /** 用于维护当前正在操作的节点的配置信息映射 */
  currentNodeInfoMap: Record<string | number, NodeInfo>;
  /** 用于判断是否展示参数值列表出错信息 */
  isShowValuesError: boolean;

  form?: FormInstance<any, any, string | number | symbol>;
  downloadForm?: FormInstance<any, any, string | number | symbol>;
  /** 控制-从数据集导入-的Select全局状态, 用来在Modal弹窗"确认"之后清空Select */
  selectedDatasets: string[];
  setSelectedDatasets: (datasets: string[]) => void;
  clearSelectedDatasets: () => void;
}

export const getDefaultStore = (): Omit<
  StateType,
  | 'reset'
  | 'updateCurrentConfig'
  | 'deleteParamsConfig'
  | 'updateParamsConfig'
  | 'copy'
  | 'addParamsConfig'
  | 'updateCurrentNodeInfoMap'
  | 'batchAddParamsConfig'
  | 'batchUpdateParamsConfig'
  | 'setSelectedDatasets'
  | 'clearSelectedDatasets'
> => ({
  // taskName: languageUtils.getText(TranslateKeys.BATCH_TASK_TITLE),
  taskName: '',
  currentParamsConfig: {
    config_id: uuid(),
    type: 'data',
    nodeId: undefined,
    internal_name: undefined,
    name: I18n.t('parameter_1', {}, '参数1'),
    values: [],
  },
  allNodesOptions: [],
  paramsConfig: [],
  paramsListDisplayMode: ParamsListDisplayMode.TABLE,
  paramsEditMode: 'create',
  editIndex: -1,
  checkWorkflowLoading: false,
  currentNodeInfoMap: {},
  isShowValuesError: false,
  selectedDatasets: [],
});

export const useCreatorStore = create<StateType>((set, get) => ({
  ...getDefaultStore(),
  updateCurrentNodeInfoMap(key: string | number, nodeInfo: NodeInfo) {
    const state = get();
    set({
      currentNodeInfoMap: Object.assign({}, state.currentNodeInfoMap, {
        [key]: nodeInfo,
      }),
    });
  },
  updateCurrentConfig(obj: Partial<ParamsConfigTypeItem>) {
    const state = get();
    set({
      currentParamsConfig: Object.assign({}, state.currentParamsConfig, obj),
    });
  },
  addParamsConfig() {
    const { paramsConfig } = get();
    set({
      currentParamsConfig: {
        config_id: uuid(),
        type: 'data',
        nodeId: undefined,
        internal_name: undefined,
        name: `${languageUtils.getText(TranslateKeys.PARAM_NAME)}${
          paramsConfig.length + 1
        }`,
        values: [],
      },
      editIndex: -1,
      paramsEditMode: 'create',
    });
  },
  updateParamsConfig(obj: ParamsConfigTypeItem, index = -1) {
    set({
      currentParamsConfig: _.cloneDeep(obj),
      paramsEditMode: 'edit',
      editIndex: index,
    });
    openParamsConfigModal();
  },
  deleteParamsConfig(index: number): void {
    const state = get();
    state.paramsConfig.splice(index, 1);
    set({
      paramsConfig: [...state.paramsConfig],
    });
  },
  copy(info: {
    taskName: StateType['taskName'];
    paramsConfig: StateType['paramsConfig'];
  }): void {
    set({
      taskName: `${info.taskName}[copy]`,
      paramsConfig: info.paramsConfig?.filter((p) => p.category !== 'system'),
    });
  },
  reset(names?: ResetParamNames) {
    const initDefaultStore = getDefaultStore();

    if (names) {
      // 重置指定项
      const newPartialState: Partial<Pick<StateType, ResetParamNames[number]>> =
        {};
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      names.forEach((name) => (newPartialState[name] = initDefaultStore[name]));
      set((oldState) => {
        oldState.form?.setFieldsValue(newPartialState);
        return {
          ...oldState,
          ...newPartialState,
        };
      });
    } else {
      // 重置全部
      set(initDefaultStore);
    }
  },
  batchAddParamsConfig(configList: ParamsConfigType) {
    const { paramsConfig } = get();
    paramsConfig.push(...configList);
    set({
      paramsConfig: [...paramsConfig],
    });
  },
  batchUpdateParamsConfig(configList: ParamsConfigType) {
    const { paramsConfig } = get();
    // 遍历configList,如果config_id已存在则替换,不存在则保留等待后续push
    configList.forEach((config: ParamsConfigTypeItem, index) => {
      const existingIndex = paramsConfig.findIndex(
        (p) => p.config_id === config.config_id,
      );
      if (existingIndex !== -1) {
        paramsConfig[existingIndex] = config;
        // 从configList中删除已处理的config 避免foreach索引混乱
        configList.splice(index, 1);
      }
    });
    set({
      paramsConfig: [...paramsConfig],
    });
  },
  selectedDatasets: [],
  setSelectedDatasets: (datasets) => set({ selectedDatasets: datasets }),
  clearSelectedDatasets: () => set({ selectedDatasets: [] }),
}));
