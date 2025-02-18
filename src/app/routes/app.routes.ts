import { Routes } from '@angular/router';

// import { HomeComponent } from '../features/general/home/home.component'
// import { NotFoundComponent } from '../features/general/not-found/not-found.component';
import { LoginComponent } from '../pages/login/login.component';
import { loginGuard } from '../guardrouter/login.guard';
// import { authGuard } from '../guardrouter/auth.guard';
import { URL_ROUTER } from '../shared/constants/path.constants';
export const routes: Routes = [
  {
    path: URL_ROUTER.login,
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('../pages/home/home.component').then((mod) => mod.HomeComponent),
    data: { title: 'Trang chủ' },
  },
  {
    path: URL_ROUTER.news,
    loadChildren: () =>
      import('../pages/news/news.module').then((mod) => mod.NewModule),
    data: { title: 'Tin tức' },
  },
  {
    path: URL_ROUTER.profile,
    loadChildren: () =>
      import('../pages/profile/profile.module').then(
        (mod) => mod.ProfileModule
      ),
    data: { title: 'Thông tin cá nhân' },
  },
  {
    path: URL_ROUTER.contact,
    loadComponent: () =>
      import('../pages/contact/contact.component').then(
        (mod) => mod.ContactComponent
      ),
    data: { title: 'Liên hệ' },
  },
  {
    path: URL_ROUTER.documents,
    loadChildren: () =>
      import('../pages/documents/documents.module').then(
        (mod) => mod.DocumentsModule
      ),
    data: { title: 'tài liệu' },
  },
  {
    path: URL_ROUTER.notFound,
    loadComponent: () =>
      import('../pages/not-found/not-found.component').then(
        (mod) => mod.NotFoundComponent
      ),
    data: { title: '404 - Not Found' },
  },

  // if not found a page, force redirect to home
  // { path: '**', redirectTo: URL_ROUTER.notFound },
];
