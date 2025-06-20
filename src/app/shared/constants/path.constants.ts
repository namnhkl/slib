export const URL_ROUTER = {
  login: 'login',
  home: '',
  about: 'about',
  /* tin tức */
  QtndTinTuc: 'QtndTinTuc',
  QtndTinTucChiTiet: 'QtndTinTucChiTiet',
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
  documents: 'tai-lieu',
  chuyende:'stsBoSuuTapDs-chuyen-de',
  chuyendeitem:'stsBoSuuTapDs-chuyen-de-item',
  chuyendedetail:'stsBoSuuTapDs-chuyen-de-detail',
  viewdocument:'viewdocument',
  intro:'intro',
  medialibrary:'medialibrary',
  gioithieuchitiet:'gioi-thieu-chi-tiet',
  vbqpphapluat:'vbqp-phap-luat',
  sachhay:'sach-hay',
  sachhaychitiet:'sach-hay-chi-tiet'
} as const;
