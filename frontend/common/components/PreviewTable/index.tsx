// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// SPDX-License-Identifier: GPL-3.0-or-later
// 通用的预览表格

import { useEffect, useMemo, useRef, useState } from 'react';

import { Table, type TableInstance } from '@arco-design/web-react';
import { type ColumnProps } from '@arco-design/web-react/es/Table';

import {
  type PreviewTableDataType,
  type PreviewTableRowDataType,
} from './type/table';

export interface PreviewTableProps {
  data: PreviewTableDataType;
  cellSize: number;
  columnList: ColumnProps<PreviewTableRowDataType>[];
  cellValue2UrlMap: any;
  renderRect: {
    height: number;
  };
}

import styles from './index.module.scss';
import { usePreviewTableStore } from './store';
import { uuid } from '@common/utils/uuid';
import { I18n } from '@common/i18n';

export const PreviewTable: React.FC<PreviewTableProps> = ({
  data,
  cellSize,
  columnList,
  renderRect,
}) => {
  const columnNumber = useMemo(() => columnList.length, [columnList]);
  const tableContainerRef = useRef<TableInstance>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    usePreviewTableStore.setState({
      cellSize,
    });
  }, [cellSize]);

  const rowEventConfig = (record: any, index: number) => ({
    onClick: () => {
      // 表头不允许左右切换
      const isHeaderRow = record instanceof Array;
      usePreviewTableStore.setState({
        currentRow: isHeaderRow ? -1 : index,
      });
    },
    onMouseEnter: (e: any) => {
      const tr = e.target?.closest('tr');
      if (!tr) {
        console.error('init video row autoplay failed');
        return;
      }
      const siblingVideos = tr.querySelectorAll('video');
      siblingVideos.forEach((siblingVideo: any) => {
        siblingVideo.currentTime = 0;
        siblingVideo.loop = true;
        // 添加悬浮播放控制
        siblingVideo.play();
      });
    },
    onMouseLeave: (e: any) => {
      const tr = e.target?.closest('tr');
      if (!tr) {
        console.error('init video row autoplay failed');
        return;
      }
      const siblingVideos = tr.querySelectorAll('video');
      siblingVideos.forEach((siblingVideo: any) => {
        siblingVideo.loop = false;
        // 添加悬浮暂停控制
        siblingVideo.pause();
        siblingVideo.currentTime = 0;
      });
    },
  });

  useEffect(() => {
    usePreviewTableStore.setState({
      data,
      columnList,
    });
  }, [columnList, data]);

  const columns = useMemo(
    () =>
      columnList.map((column, index) => ({
        ...column,
        onCell(r: any, i: any) {
          return {
            ...(column?.onCell ? column.onCell(r, i) : {}),
            onClick: (e: any) => {
              if (column?.onCell?.(r, i).onClick) {
                column.onCell(r, i).onClick?.(e);
              }
              usePreviewTableStore.setState({
                currentCol: index,
              });
            },
          };
        },
        onHeaderCell: () => ({
          onClick: () => {
            usePreviewTableStore.setState({
              currentCol: index,
              currentRow: -1,
            });
          },
        }),
      })),
    [columnList],
  );

  useEffect(() => {
    const c = tableContainerRef.current;
    if (!c) {
      return;
    }

    const element = c
      .getRootDomElement()
      ?.querySelector('.arco-table-tr') as HTMLElement;

    if (!element) {
      return;
    }

    const observer = new MutationObserver(() => {
      setHeight(element.offsetHeight);
    });

    observer.observe(element, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    setHeight(element.offsetHeight);

    return () => {
      observer.disconnect();
    };
  }, []);

  const TableContent = useMemo(
    () => (
      // 最佳方案是通过columns或data序列化出一个唯一key来实现重绘
      <Table
        ref={tableContainerRef}
        className={styles.table}
        rowKey="id"
        columns={columns}
        key={uuid()} // 添加key强制重新渲染
        data={data}
        style={{
          width:
            cellSize * columnNumber > window.innerWidth - 48
              ? '100%'
              : 'min-content',
        }}
        scroll={{
          x: true,
          y: renderRect.height - height - 2,
        }}
        border={{
          wrapper: true,
          cell: true,
        }}
        noDataElement={I18n.t('no_data_yet', {}, '暂无数据')}
        pagination={false}
        onHeaderRow={rowEventConfig}
        onRow={rowEventConfig}
      />
    ),
    [cellSize, columnNumber, columns, data, height, renderRect.height],
  );

  return TableContent;
};
