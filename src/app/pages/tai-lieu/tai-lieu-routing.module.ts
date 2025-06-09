import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaiLieuComponent } from './tai-lieu.component';
import { TaiLieuChiTietComponent } from './tai-lieu-chi-tiet/tai-lieu-chi-tiet.component';
// import { DocumentsSearchComponent } from './documents-search/documents-search.component';

const routes: Routes = [
  {
    path: '',
    component: TaiLieuComponent,
  },
  // {
  //   path: 'author',
  //   component: DocumentsSearchComponent,
  // },
  {
    path: ':id',
    component: TaiLieuChiTietComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaiLieuRoutingModule {}
