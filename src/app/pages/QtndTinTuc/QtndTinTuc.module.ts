import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QtndTinTucRoutingModule } from './QtndTinTuc-routing.module';
import { QtndTinTucChiTietComponent } from './QtndTinTucChiTiet/QtndTinTucChiTiet.component';

@NgModule({
  imports: [CommonModule, QtndTinTucRoutingModule],
  declarations: [QtndTinTucChiTietComponent],
})
export class QtndTinTucModule {}
