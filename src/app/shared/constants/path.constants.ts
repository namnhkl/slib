export const URL_ROUTER = {
  login: 'login',
  home: '',
  about: 'about',
  /* tin tức */
  news: 'news',
  newDetail: 'details',
  /* end tin tức */
  contact: 'contact',
  searchResult: 'search-results',
  profile: 'profile',
  notFound: '404',
  // quản lý
  management: {
    groupRole: 'management/group-role',
    user: 'management/user',
  },
  // hết quản lý
  // quản lý
  category: {
    dynamicCategory: 'category/dynamic-category',
    dataDynamicCategory: 'category/data-dynamic-category',
  },
  system: {
    user: 'system/user',
    menu: 'system/menus',
    role: 'system/roles',
  },
  // hết quản lý
  // dynamic form
  dynamicForm: {
    form: 'dynamic-form/form',
  },
  // end dynamicform

  // map form
  map: {
    dynamicMap: 'map/dynamic-map',
  },
  // end map form
  // document start
  documents: 'documents',
  // document end
} as const;
