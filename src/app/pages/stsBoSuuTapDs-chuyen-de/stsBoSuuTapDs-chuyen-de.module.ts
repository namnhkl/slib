// src/app/chuyen-de/chuyen-de.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { stsBoSuuTapDsChuyenDeListComponent } from './stsBoSuuTapDs-chuyen-de-list/stsBoSuuTapDs-chuyen-de-list.component';
import { SortByCapPipe } from './stsBoSuuTapDs-sort-by-cap.pipe';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: stsBoSuuTapDsChuyenDeListComponent }
];

@NgModule({
  declarations: [stsBoSuuTapDsChuyenDeListComponent, SortByCapPipe],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NzCarouselModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    RouterModule.forChild(routes)
  ],
  exports: [stsBoSuuTapDsChuyenDeListComponent]
})
export class stsBoSuuTapDsChuyenDeModule {}