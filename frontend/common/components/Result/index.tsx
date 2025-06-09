// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import {
  Result as ArcoResult,
  type ResultProps as ArcoResultProps,
} from '@arco-design/web-react';

import { ReactComponent as IconEmpty } from '@static/icons/empty.svg';
import { ReactComponent as IconNetwork } from '@static/icons/network_error.svg';

import './index.scss';
import { I18n } from '@common/i18n';

enum ResultStatus {
  Empty = 'Empty',
  NetworkError = 'NetworkError',
}

const ResultDisplay = {
  [ResultStatus.Empty]: {
    icon: <IconEmpty />,
    message: I18n.t(
      'no_relevant_content__try_another_word~',
      {},
      '无相关内容，换个词试试～',
    ),
  },
  [ResultStatus.NetworkError]: {
    icon: <IconNetwork />,
    message: I18n.t(
      'network_exception__try_again_later~',
      {},
      '网络异常，稍后再试～',
    ),
  },
} as const;

interface ResultProps extends Omit<ArcoResultProps, 'status'> {
  status: ResultStatus | ArcoResultProps['status'];
}

export default function Result({ status, ...othersProps }: ResultProps) {
  const { icon, message } =
    status && status in ResultStatus
      ? ResultDisplay[status as ResultStatus]
      : {
          icon: undefined,
          message: undefined,
        };

  return (
    <ArcoResult
      status={null}
      icon={icon}
      title={message ? <div className="global-result">{message}</div> : null}
      {...othersProps}
    />
  );
}

Result.Status = ResultStatus;
