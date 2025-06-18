import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VbqpPhapLuatChiTietComponent } from './vbqp-phap-luat-chi-tiet/vbqp-phap-luat-chi-tiet.component';
import { VbqpPhapLuatComponent } from './vbqp-phap-luat.component';

const route: Routes = [
  {
    path: '',
    component: VbqpPhapLuatComponent,
  },
  {
    path: ':id',
    component: VbqpPhapLuatChiTietComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class VbqpPhapLuatRoutingModule {}
