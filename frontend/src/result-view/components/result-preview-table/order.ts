import { type ColumnProps } from '@arco-design/web-react/es/Table';
import {
  PreviewTableDataType,
  PreviewTableRowDataType,
} from '@common/components/PreviewTable/type/table';

export const orderColumns = (
  columns: ColumnProps<PreviewTableRowDataType>[],
  get: (key: string) => any,
) => {
  const len = columns.length;
  let lastIndex = len - 1;

  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    const col = columns[i];
    const config = get(col.dataIndex || '');
    if (!col.dataIndex || !config) {
      result[i] = col; // 保留原位置
      continue;
    }
    const order = config.order ?? lastIndex--;
    result[order] = col;
  }

  return result.filter(Boolean) as ColumnProps<PreviewTableRowDataType>[];
};

export const orderRows = (
  data: PreviewTableDataType,
  get: (key: string) => any,
) => {
  const len = data.length;
  let lastIndex = len - 1;

  const result = new Array(len);

  for (let i = 0; i < len; i++) {
    const col = data[i];
    const config = get(col.id || '');
    if (!col.id || !config) {
      result[i] = col; // 保留原位置
      continue;
    }
    const order = config.order ?? lastIndex--;
    result[order] = col;
  }

  return result.filter(Boolean) as PreviewTableDataType;
};
