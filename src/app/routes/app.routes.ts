import { Routes } from '@angular/router';

// import { HomeComponent } from '../features/general/home/home.component'
// import { NotFoundComponent } from '../features/general/not-found/not-found.component';
import { LoginComponent } from '../pages/login/login.component';
// import { authGuard } from '../guardrouter/auth.guard';
import { URL_ROUTER } from '../shared/constants/path.constants';
import { ContactComponent } from '../pages/contact/contact.component';
import { HomeComponent } from '../pages/home/home.component';
import { authGuard } from '../guardrouter/auth.guard';
import { stsBoSuuTapDsChuyenDeListComponent } from '../pages/stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de-list/stsBoSuuTapDs-chuyen-de-list.component';
import { stsBoSuuTapDsChuyenDeItemComponent } from '../pages/stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de-item/stsBoSuuTapDs-chuyen-de-item.component';
import { IntroComponent } from '../shared/components/intro/intro.component';
import { stsBoSuuTapDsChuyenDeDetailComponent } from '../pages/stsBoSuuTapDs-chuyen-de/stsBoSuuTapDs-chuyen-de-detail/stsBoSuuTapDs-chuyen-de-detail.component';
import { MediaLibraryComponent } from '../pages/home/MediaLibrary/MediaLibrary.component';
export const routes: Routes = [
  {
    path: URL_ROUTER.login,
    component: LoginComponent,
    canMatch: [authGuard({ requiresAuthentication: false })],
  },
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'home' }
  },
  { path: URL_ROUTER.chuyende, component: stsBoSuuTapDsChuyenDeListComponent,
    data: { breadcrumb: 'topics' }
   }, // Trang chuyên đề,
  { path: URL_ROUTER.chuyendeitem, component: stsBoSuuTapDsChuyenDeItemComponent,data: { breadcrumb: 'Danh sách item trong chuyên đề' } },
   { path: URL_ROUTER.chuyendedetail, component: stsBoSuuTapDsChuyenDeDetailComponent,data: { breadcrumb: 'Chi tiết Chuyên đề' } },
   { path: URL_ROUTER.medialibrary, component: MediaLibraryComponent,data: { breadcrumb: 'Thư viện Video, Audio' } },
  {
    path: URL_ROUTER.QtndTinTuc,
    loadChildren:  () => import('../pages/QtndTinTuc/QtndTinTuc-routing.module').then(module => module.QtndTinTucRoutingModule),
    data: { breadcrumb: 'news' }
  },
  {
    path: URL_ROUTER.searchResult,
    loadChildren: async () =>
      (await import('../pages/tai-lieu/tai-lieu-ket-qua-tim-kiem/tai-lieu-ket-qua-tim-kiem.module')).SearchResultsModule,
    data: { breadcrumb: 'search' }
  },
  {
    path: URL_ROUTER.profile,
    loadChildren: () =>
      import('../pages/profile/profile-routing.module')
        .then(module => module.ProfileRoutingModule),
    canMatch: [authGuard()],
    data: { breadcrumb: 'profile' }
  },
  {
    path: URL_ROUTER.contact,
    component: ContactComponent,
    data: { breadcrumb: 'contact' }
  },
  {
    path: URL_ROUTER.intro,
    component: IntroComponent,
    data: { breadcrumb: 'intro' }
  },
  {
    path: URL_ROUTER.documents,
    loadChildren: () => import('../pages/tai-lieu/tai-lieu-routing.module').then(module => module.TaiLieuRoutingModule),
    data: { breadcrumb: 'document' }
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
