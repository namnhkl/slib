import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SachHayRoutingModule } from './sach-hay-routing.module';
import { SachHayChiTietComponent } from './sach-hay-chi-tiet/sach-hay-chi-tiet.component';


@NgModule({
  imports: [CommonModule, SachHayRoutingModule],
  declarations: [SachHayChiTietComponent],
})
export class SachHayModule {}
