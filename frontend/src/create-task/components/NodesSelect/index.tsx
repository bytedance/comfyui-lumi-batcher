// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useCallback, useEffect, useState } from 'react';

import { TreeSelect } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import './index.scss';
import { useCreatorStore } from '@src/create-task/store';
import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '@common/language';
const TreeNode = TreeSelect.Node;

export interface NodesSelectSharedValueType {
  id: string;
  nodeLabel: string;
}

export const NodesSelect = (props: {
  // column: DatasetColumnsInfo;
  nodesSelectSharedMap: Record<string, string>;
  addBefore?: React.ReactNode;
  onSelect: (value: string) => void;
  defaultValue?: string;
}) => {
  const { addBefore, defaultValue, onSelect, nodesSelectSharedMap } = props;
  const [maxHeight, setMaxHeight] = useState(300);
  const [
    currentParamsConfig,
    paramsConfig,
    allNodesOptions, // 现在直接从store获取
    editIndex,
  ] = useCreatorStore(
    useShallow((state) => [
      state.currentParamsConfig,
      state.paramsConfig,
      state.allNodesOptions,
      state.editIndex,
    ]),
  );

  const { type } = currentParamsConfig;
  const [treeValue, setTreeValue] = useState<string | string[]>('');
  // 设置树形组件的最大高度
  useEffect(() => {
    const dom = document.querySelector('.params-config-modal-wrap');
    dom?.clientHeight && setMaxHeight(Math.min(dom?.clientHeight - 250, 500));
  }, []);

  // 设置树形组件的值
  useEffect(() => {
    const { nodeId, internal_name } = currentParamsConfig;

    if (type === 'group') {
      if (currentParamsConfig.values.length > 0) {
        setTreeValue(
          currentParamsConfig.values.map((item) =>
            JSON.stringify({
              id: item.nodeId,
              nodeLabel: item.internal_name,
            }),
          ),
        );
      } else {
        setTreeValue('');
      }
    } else {
      if (nodeId && internal_name) {
        setTreeValue(
          JSON.stringify({
            id: currentParamsConfig.nodeId,
            nodeLabel: currentParamsConfig.internal_name,
          }),
        );
      } else {
        setTreeValue('');
      }
    }
  }, [currentParamsConfig]);

  // 判断子节点是否可以选中
  const getDisabled = useCallback(
    (nodeId: string | number, internal_name: string) => {
      let status = false;
      paramsConfig.forEach((p, i) => {
        if (i === editIndex || status) {
          return;
        }

        if (p.type === 'group') {
          status = p.values.some(
            (v) => v.nodeId === nodeId && v.internal_name === internal_name,
          );
        } else if (p.nodeId === nodeId && p.internal_name === internal_name) {
          status = true;
        }
      });
      if (status) {
        return status;
      }
      // 遍历 nodesSelectSharedMap 检查是否已被选择
      Object.values(nodesSelectSharedMap).forEach((value) => {
        if (!value || status) {
          return;
        }
        try {
          const parsedValue: NodesSelectSharedValueType = JSON.parse(value);
          if (
            parsedValue.id === nodeId &&
            parsedValue.nodeLabel === internal_name
          ) {
            status = true;
          }
        } catch (e) {
          console.error('解析 nodesSelectSharedMap 值失败:', e);
        }
      });

      return status;
    },
    [paramsConfig, nodesSelectSharedMap],
  );

  return (
    <TreeSelect
      addBefore={addBefore}
      value={treeValue}
      defaultValue={defaultValue}
      allowClear
      triggerProps={{
        className: 'params-select-container',
      }}
      dropdownMenuStyle={{
        height: maxHeight,
        maxHeight: 'unset',
      }}
      showSearch
      filterTreeNode={(inputText, node) =>
        node.props.title.toLowerCase().indexOf(inputText.toLowerCase()) > -1
      }
      placeholder={
        type === 'group'
          ? I18n.t(
              'please_select_or_fuzzy_search__select_at_least_2',
              {},
              '请选择或模糊搜索，至少选择2个',
            )
          : languageUtils.getText(TranslateKeys.SELECT_NODE_PLACEHOLDER)
      }
      multiple={type === 'group'}
      treeCheckable={type === 'group'}
      onChange={(value) => {
        // FIXME: 这里需要根据当前的columnId来更新
        // updateNodesSelectSharedMap(column.id, value);
        console.log('NodeSelect onChange', value);
        setTreeValue(value);
        onSelect(value);
      }}
    >
      {allNodesOptions.map((parent) => {
        const { paramsList, id, label } = parent;
        const showParamsList = paramsList.filter((p) => !p.isLinked);
        if (!showParamsList?.length) {
          return null;
        }
        return (
          // #9: SaveImage 节点默认不支持选中
          <TreeNode key={id} title={label} disabled>
            {showParamsList.map((node) => {
              const { label: nodeLabel } = node;

              return (
                <TreeNode
                  key={JSON.stringify({
                    id,
                    nodeLabel,
                    // nodeValue,
                  })}
                  title={nodeLabel}
                  isLeaf
                  disabled={getDisabled(id, nodeLabel)}
                />
              );
            })}
          </TreeNode>
        );
      })}
    </TreeSelect>
  );
};
