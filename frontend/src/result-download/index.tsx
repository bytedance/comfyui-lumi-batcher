// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { useCallback, useEffect, useState } from 'react';

import { type ButtonProps, Message } from '@arco-design/web-react';
import { debounce } from 'lodash';

import { ReactComponent as IconDownload } from '../../static/icons/image-download.svg';
import { PackageStatusEnum, TaskStatusEnum } from '../task-list/constants';
import { I18n } from '@common/i18n';
import use2Ref from '@common/hooks/use-2-ref';
import { getTaskDetail } from '@api/batch-task';
import IconButtonTooltip from '@common/components/IconButtonTooltip';
import { processDownloadUrl } from '@common/utils/process-resource';
import { batchDownloadZipByGetUrl } from '@api/download';
import { sendBatchToolsDownloadResult } from '../../data/points';

export default function ResultDownload({
  taskId,
  statusInfo,
  size = 'default',
}: {
  taskId: string;
  statusInfo?: {
    status: TaskStatusEnum;
    packageStatus: PackageStatusEnum;
  };
  size?: ButtonProps['size'];
}) {
  const [innerStatusInfo, setInnerStatusInfo] = useState(statusInfo);
  const innerStatusInfoRef = use2Ref(innerStatusInfo);
  const [refreshCount, setRefreshCount] = useState(0);

  const onDownload = useCallback(
    debounce(async () => {
      try {
        sendBatchToolsDownloadResult();
        const res = await getTaskDetail(taskId);
        const { package_info, name } = res.data.data;
        if (package_info.status !== PackageStatusEnum.Succeed) {
          throw new Error(I18n.t('system_error', {}, '系统错误'));
        }
        batchDownloadZipByGetUrl(processDownloadUrl(package_info.result), name);
      } catch (err) {
        console.error('下载失败', err);
        Message.error(I18n.t('download_failed', {}, '下载失败'));
      }
    }, 500),
    [taskId],
  );

  useEffect(() => {
    const timeId = setTimeout(() => {
      setRefreshCount((count) => count + 1);
    }, 10000);
    const clear = () => clearTimeout(timeId);

    // 外部传了 statusInfo，则不需要轮询
    if (statusInfo) {
      // 外部变更 statusInfo 内状态，更新到内部
      setInnerStatusInfo(statusInfo);
      clear();
      return;
    }

    // 内部轮询打包结果为成功或失败，则不再轮询
    if (
      innerStatusInfoRef.current &&
      [PackageStatusEnum.Succeed, PackageStatusEnum.Failed].includes(
        innerStatusInfoRef.current.packageStatus,
      )
    ) {
      clear();
      return;
    }

    (async () => {
      const res = await getTaskDetail(taskId);
      const { status, package_info } = res.data.data;
      setInnerStatusInfo({
        status,
        packageStatus: package_info.status,
      });
    })();

    return clear;
  }, [taskId, statusInfo?.status, statusInfo?.packageStatus, refreshCount]);

  // 非成功状态和非部分成功状态不展示
  if (
    !innerStatusInfo ||
    ![
      TaskStatusEnum.Succeed,
      TaskStatusEnum.PartiallySucceeded,
      TaskStatusEnum.Canceled,
    ].includes(innerStatusInfo.status)
  ) {
    return null;
  }

  return (
    <IconButtonTooltip
      icon={<IconDownload />}
      onClick={onDownload}
      size={size}
      tooltip={{
        content: {
          [PackageStatusEnum.Waiting]: I18n.t(
            'the_result_set_has_been_generated_and_is_to_be_packaged__please_wait_a_moment_',
            {},
            '结果集已生成，待打包处理，请稍等',
          ),
          [PackageStatusEnum.Packing]: I18n.t(
            'the_result_set_is_being_packaged_and_processed__please_wait_a_moment_',
            {},
            '结果集已正在打包处理，请稍等',
          ),
          [PackageStatusEnum.Failed]: (
            <>
              {I18n.t(
                'result_set_packaging_processing_failed',
                {},
                '结果集打包处理失败',
              )}
            </>
          ),
          [PackageStatusEnum.Succeed]: I18n.t(
            'the_result_set_has_been_packaged__click_to_download_',
            {},
            '结果集已打包完成，点击下载',
          ),
        }[innerStatusInfo.packageStatus],
      }}
      disabled={innerStatusInfo.packageStatus !== PackageStatusEnum.Succeed}
    />
  );
}
