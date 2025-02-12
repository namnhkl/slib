export const API_ROUTER = {
  LOGIN: '/auth',
  testAuth: '/values/get',
  system: {
    user: {
      create: '/users',
      get: '/users',
      getById: '/users',
      getByUnit: '/users/get-list-don-vi',
      getUsersByUnit: '/users/get-user-don-vi',
    },
    MENU: {
      GET: '/menus',
      GET_BY_ID: '/menus',
      CREATE: '/menus',
      UPDATE: '/menus',
      DELETE: '/menus',
    },
    ROLE: {
      GET: '/roles',
      GET_BY_ID: '/roles',
      CREATE: '/roles',
      UPDATE: '/roles',
      DELETE: '/roles',
    },
  },
  DYNAMIC_FORM: {
    GET: '/dynamic-form',
    GET_BY_ID: '/dynamic-form/',
    CREATE: '/dynamic-form',
    UPDATE: '/dynamic-form/',
    DELETE: '/dynamic-form/',
    GETBYCONDITION: '/dynamic-form/get-by-condition/',
    EXPORTPHIEUKHAOSAT: '/dynamic-form/export-word-phieukhaosat/',
    EXPORTPHIEUKHAOSATPDF: '/dynamic-form/export-pdf-phieukhaosat/',
  },
  categories: {
    dynamicCategory: {
      categoryCRUD: '/Categories',
      categoryDataClone: '/CategoryDatas/clone-tree',
      getByCode: '/Categories/get-by-code',
      getDataSelect: '/Categories/get-data-select',
      getAll: '/Categories/GetAll',
      /// //// CategoryColumns///////////
      categoryColumnCRUD: '/CategoryColumns',
      getColumnByCategory: '/CategoryColumns/get-by-category',
      /// //// end CategoryColumns///////////
      /// //// CategoryDatas///////////
      categoryDataCRUD: '/CategoryDatas',
      getDataByCategory: '/CategoryDatas/get-by-category',
      getCategorySelect: '/CategoryDatas/get-category-select',
      getCategoryTreeByCode: '/CategoryDatas/get-data-tree',
      getDataByCategoryData: '/categorydatas/get-by-category-data',
      /// //// end CategoryDatas///////////

      /// //// categorydata ///////

      // Điểm khảo sát
      categoryDataAtResearchPoint: '/categorydatas/get-data-tree-diemkhaosat',
      /// //// end categorydata ///////

      /*  */
      dup_categoryCRUD: '/categories',
      /*  */
    },
  },

  ASSIGNMENT: {
    GET: '/assignment',
    CREATE: '/assignment',
    UPDATE: '/assignment',
    DELETE: '/assignment',
    GET_BY_ID: '/assignment',
  },

  PERMISSION_DATA: {
    GET: '/permissiondatas',
    GET_DATA_TREE: '/permissiondatas/get-data-tree',
    CREATE: '/permissiondatas',
    CREATE_MULTIPLE: '/permissiondatas/createmulti',
    GET_USER_WITH_PERMISSION: '/permissiondatas',
  },

  PERMISSION_TASK: {
    GET: '/permissiontask',
    GET_DATA_BY_RECORD: '/permissiontask/get-data-by-record',
    CREATE: '/permissiontask',
  },

  USER_PERMISSION: '/permission',

  BUSINESS_SELECTION: {
    GET_PARENT: ({ recordId, loai }: any) => `/permissiontask/${recordId}/get-method-tree/${loai}`,
    GET_CHILDREN: ({ recordId, formCode, loai }: any) => `/permissiontask/${recordId}/get-dynamic-field-by-loai/${formCode}/${loai}`,
    PUT_FORM_CHILDREN: '/permissiontask',
  },
};

export const API_PREFIX = {
  '/auth': '/auth',
  '/values/get': '/values/get',
  '/users': '/users',
  '/menus': '/menus',
  '/roles': '/roles',
  '/dynamic-form': '/dynamic-form',
  '/Categories': '/Categories',
  '/categories': '/categories',
  '/CategoryDatas': '/CategoryDatas',
  '/categorydatas': '/categorydatas',
  '/CategoryColumns': '/CategoryColumns',
  '/assignment': '/assignment',
  '/permissiondatas': '/permissiondatas',
  '/permissiontask': '/permissiontask',
  '/permission': '/permission',
};

export type TApiPrefix = keyof typeof API_PREFIX;
