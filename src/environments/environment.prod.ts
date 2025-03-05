import { appInfo, applicationBase } from './environment.common';

export const environment = {
  appInfo,
  application: {
    ...applicationBase,
  },
  production: false,
  authServer: 'https://api.demo.slib.vn:6787/api/thuvien',
};
