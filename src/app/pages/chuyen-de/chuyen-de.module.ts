// src/app/chuyen-de/chuyen-de.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ChuyenDeListComponent } from './chuyen-de-list/chuyen-de-list.component';
import { SortByCapPipe } from './sort-by-cap.pipe';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: ChuyenDeListComponent }
];

@NgModule({
  declarations: [ChuyenDeListComponent, SortByCapPipe],
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
  exports: [ChuyenDeListComponent]
})
export class ChuyenDeModule {}