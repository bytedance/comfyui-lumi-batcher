// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useCallback, useEffect, useState } from 'react';

import { TreeSelect } from '@arco-design/web-react';
import { useShallow } from 'zustand/react/shallow';

import './index.scss';
import { useCreatorStore } from '@src/create-task/store';
import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '@common/language';
import { ParamsConfigTypeItem } from '@common/type/batch-task';
import { uuid } from '@common/utils/uuid';

const TreeNode = TreeSelect.Node;

export const ParamsSelect = () => {
  const [maxHeight, setMaxHeight] = useState(300);
  const [
    currentParamsConfig,
    paramsConfig,
    allNodesOptions,
    editIndex,
    updateCurrentConfig,
  ] = useCreatorStore(
    useShallow((state) => [
      state.currentParamsConfig,
      state.paramsConfig,
      state.allNodesOptions,
      state.editIndex,
      state.updateCurrentConfig,
    ]),
  );
  const { type } = currentParamsConfig;
  const [treeValue, setTreeValue] = useState<string | string[]>('');

  useEffect(() => {
    const dom = document.querySelector('.params-config-modal-wrap');
    dom?.clientHeight && setMaxHeight(Math.min(dom?.clientHeight - 250, 500));
  }, []);

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

      return status;
    },
    [paramsConfig],
  );

  return (
    <TreeSelect
      className="tree-select-wrapper"
      value={treeValue}
      allowClear
      triggerProps={{
        className: 'params-select-container',
      }}
      dropdownMenuStyle={{
        height: maxHeight,
        maxHeight: 'unset',
      }}
      size="small"
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
        console.log('TreeSelect', value);
        setTreeValue(value);
        if (!value) {
          updateCurrentConfig({
            nodeId: '',
            internal_name: '',
            values: [],
          });
        }

        if (type === 'group') {
          const res: ParamsConfigTypeItem[] = [];
          value.forEach((c: string) => {
            const param = JSON.parse(c);
            const currentValue = currentParamsConfig.values.find(
              (i) =>
                i.nodeId === param.id && i.internal_name === param.nodeLabel,
            );
            res.push({
              type: 'data',
              nodeId: param.id,
              name: param.nodeLabel,
              internal_name: param.nodeLabel,
              config_id: uuid(),
              values: currentValue ? currentValue.values : [],
            });
          });
          updateCurrentConfig({
            values: res,
          });
        } else {
          const param = JSON.parse(value);

          updateCurrentConfig({
            nodeId: param.id,
            internal_name: param.nodeLabel,
          });
        }
      }}
    >
      {allNodesOptions.map((parent) => {
        const { paramsList, id, label } = parent;
        const showParamsList = paramsList.filter((p) => !p.isLinked);
        if (!showParamsList?.length) {
          return null;
        }
        return (
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
