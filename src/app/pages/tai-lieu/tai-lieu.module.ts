import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaiLieuComponent } from './tai-lieu.component';
import { TaiLieuChiTietComponent } from './tai-lieu-chi-tiet/tai-lieu-chi-tiet.component';
import { TaiLieuRoutingModule } from './tai-lieu-routing.module';
import { TaiLieuService } from './tai-lieu.service';
import { TaiLieuTimKiemComponent } from './tai-lieu-tim-kiem/tai-lieu-tim-kiem.component';
import { SharedModule } from '@/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule, TaiLieuRoutingModule],
  declarations: [
    TaiLieuComponent,
    TaiLieuChiTietComponent,
    TaiLieuTimKiemComponent,
  ],
  providers: [TaiLieuService],
})
export class TaiLieuModule {}
