import { getValueByPrefix } from './local-storage';

export const getCurrentToken = () => {
  const obj = getValueByPrefix('firebase:authUser');
  if (!obj) {
    return '';
  }
  try {
    return JSON.parse(obj)?.stsTokenManager?.accessToken ?? '';
  } catch (error) {
    return '';
  }
};

export const getCurrentApiKey = () => {
  const obj = getValueByPrefix('firebase:authUser');
  if (!obj) {
    return '';
  }
  try {
    return JSON.parse(obj)?.apiKey ?? '';
  } catch (error) {
    return '';
  }
};
