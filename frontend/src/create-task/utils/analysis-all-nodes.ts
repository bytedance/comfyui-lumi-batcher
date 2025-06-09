// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { AllNodesOptions } from '@common/type/batch-task';
import { useCreatorStore } from '../store';

export const analysisAllNodes = () =>
  window.app?.graphToPrompt().then((res) => {
    const { output } = res;

    const allNodesOptions: AllNodesOptions = [];

    Object.keys(output).forEach((id) => {
      const nodeInfo = output[id];
      const { class_type, inputs } = nodeInfo;
      const paramsList: AllNodesOptions[0]['paramsList'] = [];

      Object.keys(inputs).forEach((key) => {
        paramsList.push({
          label: key,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          value: inputs[key],
          isLinked: typeof inputs[key] === 'object',
        });
      });

      allNodesOptions.push({
        id,
        label: `#${id}: ${class_type}`,
        paramsList,
      });
    });

    useCreatorStore.setState({
      allNodesOptions,
    });

    return {
      allNodesOptions,
    };
  });
