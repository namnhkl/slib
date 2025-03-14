import { Routes } from '@angular/router';

// import { HomeComponent } from '../features/general/home/home.component'
// import { NotFoundComponent } from '../features/general/not-found/not-found.component';
import { LoginComponent } from '../pages/login/login.component';
// import { authGuard } from '../guardrouter/auth.guard';
import { URL_ROUTER } from '../shared/constants/path.constants';
import { ContactComponent } from '../pages/contact/contact.component';
import { HomeComponent } from '../pages/home/home.component';
import { authGuard } from '../guardrouter/auth.guard';
export const routes: Routes = [
  {
    path: URL_ROUTER.login,
    component: LoginComponent,
    canMatch: [authGuard({ requiresAuthentication: false })],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: URL_ROUTER.news,
    loadChildren:  () => import('../pages/news/news-routing.module').then(module => module.NewRoutingModule),
  },
  {
    path: URL_ROUTER.searchResult,
    loadChildren: async () =>
      (await import('../pages/search-result/search-result.module')).SearchResultsModule,
  },
  {
    path: URL_ROUTER.profile,
    loadChildren: () =>
      import('../pages/profile/profile-routing.module')
        .then(module => module.ProfileRoutingModule),
    canMatch: [authGuard()],
  },
  {
    path: URL_ROUTER.contact,
    component: ContactComponent,
  },
  {
    path: URL_ROUTER.documents,
    loadChildren: () => import('../pages/documents/document-routing.module').then(module => module.DocumentRoutingModule),
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
