import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SachHayComponent } from './sach-hay.component';
import { SachHayChiTietComponent } from './sach-hay-chi-tiet/sach-hay-chi-tiet.component';

const route: Routes = [
  {
    path: '',
    component: SachHayComponent,
  },
  {
    path: ':id',
    component: SachHayChiTietComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class SachHayRoutingModule {}
