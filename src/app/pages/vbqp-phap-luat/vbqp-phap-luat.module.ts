import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  VbqpPhapLuatRoutingModule } from './vbqp-phap-luat-routing.module';
import { VbqpPhapLuatChiTietComponent } from './vbqp-phap-luat-chi-tiet/vbqp-phap-luat-chi-tiet.component';

@NgModule({
  imports: [CommonModule, VbqpPhapLuatRoutingModule],
  declarations: [VbqpPhapLuatChiTietComponent],
})
export class VbqpPhapLuatModule {}
