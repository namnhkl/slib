import { Routes } from '@angular/router';

import { HomeComponent } from './features/general/home/home.component'
import { NotFoundComponent } from './features/general/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, },
  {
    path: 'continents',
    loadComponent: () => import('./features/general/continent/item.component')
      .then(mod => mod.ItemComponent)
  },
  {
    path: 'continents/:id',
    loadComponent: () => import('./features/general/continent-form/item.component')
      .then(mod => mod.ItemComponent)
  },
  {
    path: 'login',
    loadComponent: () => import(`./features/general/login/login.component`)
      .then(mod => mod.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import(`./features/general/signup/signup.component`)
      .then(mod => mod.SignupComponent)
  },

  {
    path: 'contact',
    loadChildren: () => import(`./features/general/contact/contact.routes`)
      .then(routes => routes.routes)
  },

  {
    path: 'about',
    loadChildren: () => import('./features/general/about/about.routes')
      .then(routes => routes.routes)
  },

  { path: '**', component: NotFoundComponent }
];