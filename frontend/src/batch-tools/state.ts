import { ContainerTypeEnum } from '@common/constant/container';
import { LanguagesEnum } from '@common/language';
import { create } from 'zustand';

interface BatchToolsStoreType {
  i18n?: LanguagesEnum;
  uiConfig: {
    showVersion: boolean;
    showTitle: boolean;
    showCreateTask: boolean;
    showCopy: boolean;
    showCancel: boolean;
    listPaddingHorizontal: number;
  };
  containerRect: {
    clientHeight: number;
    clientWidth: number;
  };
  task: {
    newGuideHelpLink: string;
    outputRuleLink?: string;
  };
  onCompStatusChange?: (status: ContainerTypeEnum) => void;
  closeShareModal?: () => void;
}

const defaultStore: Omit<BatchToolsStoreType, 'reset'> = {
  uiConfig: {
    showVersion: false,
    showTitle: false,
    showCreateTask: false,
    showCopy: false,
    showCancel: false,
    listPaddingHorizontal: 0,
  },
  containerRect: {
    clientHeight: 0,
    clientWidth: 0,
  },
  task: {
    newGuideHelpLink: '',
    outputRuleLink:
      'https://bytedance.larkoffice.com/docx/LGLWdPIj8ooQyxxMAOQcWmR8nCh#AcwWdo7MFozfVHxDsVucEIienAw',
  },
};

export const useBatchToolsStore = create<BatchToolsStoreType>((set) => ({
  ...defaultStore,
  reset() {
    set(defaultStore);
  },
}));
