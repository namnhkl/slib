import { Routes } from '@angular/router';

// import { HomeComponent } from '../features/general/home/home.component'
// import { NotFoundComponent } from '../features/general/not-found/not-found.component';
import { LoginComponent } from '../pages/login/login.component';
import { loginGuard } from '../guardrouter/login.guard';
import { authGuard } from '../guardrouter/auth.guard';
import { URL_ROUTER } from '../shared/constants/path.constants';
export const routes: Routes = [
  {
    path: URL_ROUTER.login,
    component: LoginComponent,
    canActivate: [loginGuard],
  },

  {
    path: '',
    redirectTo: URL_ROUTER.home,
    pathMatch: 'full',
  },
  {
    path: URL_ROUTER.home,
    loadComponent: () =>
      import('../pages/home/home.component').then((mod) => mod.HomeComponent),
    data: { title: 'Trang chủ' },
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
  { path: '**', redirectTo: URL_ROUTER.home },
];
