import { ValueType } from './check-task-param-type';

export const getPopoverType = (valueType: ValueType) => {
  if (valueType === 'video') {
    return 'zip_video';
  } else if (valueType === 'audio') {
    return 'zip_audio';
  } else if (valueType === 'image') {
    return 'zip_image';
  } else {
    return 'xlsx';
  }
};
