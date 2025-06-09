import { mountInBody } from '@common/utils/render/mount-in-body';

import './index.scss';
import { Home } from '@src/home';
import { getFingerprint } from '@common/finger';
import { tea } from '@common/tea';

const init = async () => {
  try {
    const fingerprint = await getFingerprint();
    tea.config(fingerprint.visitorId);
  } catch (error) {
    console.error('Failed to initialize fingerprint:', error);
  }
};

export const registerBatchToolsV2Btn = async () => {
  document.body.setAttribute('arco-theme', 'dark');

  await init();

  mountInBody(<Home />, 'batch-tools-trigger-container');
};
