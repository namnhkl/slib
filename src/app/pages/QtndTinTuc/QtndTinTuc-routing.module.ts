import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QtndTinTucChiTietComponent } from './QtndTinTucChiTiet/QtndTinTucChiTiet.component';
import { QtndTinTucComponent } from './QtndTinTuc.component';

const route: Routes = [
  {
    path: '',
    component: QtndTinTucComponent,
  },
  {
    path: ':id',
    component: QtndTinTucChiTietComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class QtndTinTucRoutingModule {}
