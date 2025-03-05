import { URL_ROUTER } from '../../../shared/constants/path.constants';
import { NavbarItems } from '../models';

export const tabItems: NavbarItems[] = [
  {
    icon: 'pi pi-list',
    label: 'Quản lý',
    permission: 'quanLy',
    items: [
      {
        label: 'Quản lý nhóm quyền',
        routerLink: URL_ROUTER.management.groupRole,
      },
      {
        label: 'Quản lý người dùng',
        routerLink: URL_ROUTER.management.user,
      },
    ],
  },
];
