import { Routes } from '@angular/router';

// import { HomeComponent } from '../features/general/home/home.component'
// import { NotFoundComponent } from '../features/general/not-found/not-found.component';
import { LoginComponent } from '../pages/login/login.component';
import { loginGuard } from '../guardrouter/login.guard';
// import { authGuard } from '../guardrouter/auth.guard';
import { URL_ROUTER } from '../shared/constants/path.constants';
import { ContactComponent } from '../pages/contact/contact.component';
import { HomeComponent } from '../pages/home/home.component';
export const routes: Routes = [
  {
    path: URL_ROUTER.login,
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: URL_ROUTER.news,
    loadChildren: async () =>
      (await import('../pages/news/news-routing.module')).NewRoutingModule,
  },
  {
    path: URL_ROUTER.profile,
    loadChildren: async () =>
      (await import('../pages/profile/profile-routing.module'))
        .ProfileRoutingModule,
  },
  {
    path: URL_ROUTER.contact,
    component: ContactComponent,
  },
  {
    path: URL_ROUTER.documents,
    loadChildren: async () =>
      (await import('../pages/documents/document-routing.module'))
        .DocumentRoutingModule,
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
  { path: '**', redirectTo: URL_ROUTER.notFound },
];
