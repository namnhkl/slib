export const API_PREFIX = {
  '/auth': '/auth',
  '/values/get': '/values/get',
  '/user': '/user',
  '/menus': '/menus',
  '/roles': '/roles',
  '/tailieu': '/tailieu',
};

export type TApiPrefix = keyof typeof API_PREFIX;
