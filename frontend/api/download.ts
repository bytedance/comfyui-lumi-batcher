// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
import { Message } from '@arco-design/web-react';
import streamSaver from 'streamsaver';

import { I18n } from '@common/i18n';
import { languageUtils, TranslateKeys } from '@common/language';
import { apiPrefix } from './request-instance';

export const batchDownloadZipByGetUrl = (url: string, file_name = 'result') => {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = `${file_name}.tar`;
  document.body.appendChild(a);
  a.click();
  Message.success(languageUtils.getText(TranslateKeys.DOWNLOAD_END));
  document.body.removeChild(a);
};

export const batchDownloadByFetchUrl = (url: string, file_name = 'result') => {
  fetch(url, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file_name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
};

export const commonDownloadFileByFetchUrl = async (
  taskId: string,
  isLite = '',
  file_name = 'result',
) => {
  try {
    Message.success(
      I18n.t(
        'start_downloading_batch_task_results',
        {},
        '开始下载批量任务结果',
      ),
    );
    const url = `${window.location.origin}${apiPrefix}/batch-download-zip?task_id=${taskId}&is_lite=${isLite}`;
    const response = await fetch(url);

    const contentLength = response.headers.get('Content-Length');
    const reader = response.body!.getReader();
    const stream = new ReadableStream({
      start(controller) {
        let receivedLength = 0;
        function push() {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                controller.close();
                return;
              }
              receivedLength += value.length;
              if (contentLength) {
                const progress = (receivedLength / Number(contentLength)) * 100;
              }
              controller.enqueue(value);
              push();
            })
            .catch((error) => {
              console.error('Error reading stream:', error);
              controller.error(error);
            });
        }
        push();
      },
    });

    const newResponse = new Response(stream);
    const blob = await newResponse.blob();
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = `${file_name}.tar`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download error:', error);
  }
};

export const chromeDownloadFileByFetchUrl = async (
  taskId: string,
  isLite = '',
  file_name = 'result',
  fileHandle: any,
) => {
  const startTime = performance.now();
  const url = `${window.location.origin}${apiPrefix}/batch-download-zip?task_id=${taskId}&is_lite=${isLite}`;
  // 每次下载1MB
  const chunkSize = 1024 * 1024 * 10;
  let start;
  const chunks = [];
  Message.success(
    I18n.t('start_downloading_batch_task_results', {}, '开始下载批量任务结果'),
  );

  while (true) {
    try {
      const response = await fetch(url, {
        headers:
          start !== undefined
            ? {
                Range: `bytes=${start}-${start + chunkSize - 1}`,
              }
            : {},
      });

      if (start === undefined) {
        start = 0;
        continue;
      }

      const contentLength = Number(response.headers.get('Content-Length'));

      const reader = response.body!.getReader();

      let receivedLength = 0;

      // 创建文件流
      const writableStream = await fileHandle.createWritable();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);

        receivedLength += value.length;
        start += value.length;
        // const progress = (receivedLength / contentLength) * 100;
        // console.log('download progress', progress);
      }

      if (receivedLength < chunkSize) {
        const blob = new Blob(chunks);
        await writableStream.write(blob);
        // 下载完成
        await writableStream.close();
        const endTime = performance.now();
        console.log('下载文件耗时', endTime - startTime);
        Message.success(
          I18n.t(
            'download_batch_task_result_successfully',
            {},
            '下载批量任务结果成功',
          ),
        );
        break;
      }
    } catch (error) {
      console.error('Download error:', error, start);
      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

/** 通过ServiceWork + StreamSaver实现流式下载 */
export const streamSaverDownloadFile = async (
  taskId: string,
  isLite = '',
  file_name = 'result',
) => {
  const startTime = performance.now();
  const url = `${window.location.origin}${apiPrefix}/batch-download-zip?task_id=${taskId}&is_lite=${isLite}`;
  const fileName = `${file_name}.tar`;
  let start;
  let contentLength = 0;
  // 每次下载大小
  const chunkSize = 1024 * 1024 * 10;

  Message.success(
    I18n.t('start_downloading_batch_task_results', {}, '开始下载批量任务结果'),
  );

  if (start === undefined) {
    const controller = new AbortController();
    const { signal } = controller;
    const response = await fetch(url, { signal });
    contentLength = Number(response.headers.get('Content-Length'));
    start = 0;
    controller.abort();
  }

  const fileStream = streamSaver.createWriteStream(fileName, {
    size: contentLength,
  });

  const writer = fileStream.getWriter();

  const chunks = [];

  while (true) {
    try {
      const response = await fetch(url, {
        headers: {
          Range: `bytes=${start}-${start + chunkSize - 1}`,
        },
      });

      if (!response.ok && response.status !== 206) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body!.getReader();
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
        writer.write(value);
        receivedLength += value.length;
      }

      start += receivedLength;

      if (receivedLength < chunkSize) {
        // 下载完成
        writer.close();
        const endTime = performance.now();
        console.log('下载文件耗时', endTime - startTime);
        Message.success(
          I18n.t(
            'download_batch_task_result_successfully',
            {},
            '下载批量任务结果成功',
          ),
        );
        break;
      }
    } catch (error) {
      console.error('Download error:', error);
      console.log('error', start);
      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};
