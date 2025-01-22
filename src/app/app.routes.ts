import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages';
import { HomeComponent } from './pages/home/home.component';
import { NewsComponent } from './pages/news/news.component';
import { ContactComponent } from './pages/contact/contact.component';

export const ROUTES: Routes = [
  //lazy loading
  { path: '', loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent) },
  { path: 'news', loadComponent: () => import('./pages/news/news.component').then((c) => c.NewsComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then((c) => c.ContactComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/welcome/welcome.component').then((c) => c.WelcomeComponent) },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((c) => c.SettingsComponent) },
  // { path: '', component: HomeComponent },
  // { path: 'news', component: NewsComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'dashboard', loadComponent: () => import('./pages/welcome/welcome.component').then((c) => c.WelcomeComponent) },
  // { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then((c) => c.SettingsComponent) },
  // static loading
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
