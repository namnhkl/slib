// src/app/chuyen-de/chuyen-de-list/chuyen-de-list.component.ts
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { get } from 'lodash';
import { ChuyenDeService } from '../chuyen-de.service';
import { IChuyenDe, IChuyenDeResponse } from '../chuyen-de.type';
import { SortByCapPipe } from '../sort-by-cap.pipe';
import { LoaderService } from '@/app/shared/services/loader.service';
import { SeoService } from '@/app/core/services/seo/seo.service';
import { SafeHtmlPipe } from '@/app/shared/Pipes/safe-html.pipe';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-chuyen-de-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AsyncPipe,
    SortByCapPipe,
    SafeHtmlPipe,
    NzCollapseModule,
    NzIconModule
  ],
  templateUrl: './chuyen-de-list.component.html',
  styleUrls: ['./chuyen-de-list.component.scss'],
  providers: [ChuyenDeService]
})
export class ChuyenDeListComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    const content = 'Khám phá các chuyên đề tài liệu mới nhất tại thư viện số.';
    const title = 'Danh sách chuyên đề';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }

  chuyenDeService = inject(ChuyenDeService);
  chuyenDeList = this.chuyenDeService.getChuyenDeList().pipe(
    switchMap((res) => {
      console.log('🚀 ~ ChuyenDeListComponent ~ switchMap ~ res:', res);
      if (res.messageCode === 1) {
        this.totalRecord = res.totalRecord || 0;
        return of(get(res, 'data', []));
      }
      return [];
    })
  );

  searchTerm = '';
  pageIndex = 1;
  pageSize = 10;
  totalRecord = 0;

  ngOnInit(): void {
    console.log('🚀 ~ ChuyenDeListComponent ~ ngOnInit');
    this.loaderService.setLoading(true);
    this.searchChuyenDe();
  }

  searchChuyenDe(): void {
    this.chuyenDeList = this.chuyenDeService.getChuyenDeList({
      tieuDe: this.searchTerm,
      pageIndex: this.pageIndex - 1,
      pageSize: this.pageSize
    }).pipe(
      switchMap((res) => {
        console.log('🚀 ~ ChuyenDeListComponent ~ searchChuyenDe ~ res:', res);
        if (res.messageCode === 1) {
          this.totalRecord = res.totalRecord || 0;
          return of(get(res, 'data', []));
        }
        return [];
      })
    );
    this.changeDetectorRef.detectChanges();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.searchChuyenDe();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecord / this.pageSize);
  }

  getImageUrl(chuyenDe: IChuyenDe): string {
    return chuyenDe.anhDaiDien || 'https://via.placeholder.com/250x167?text=No+Image';
  }

  getDescription(chuyenDe: IChuyenDe): string {
    return chuyenDe.moTa || 'Chưa có mô tả';
  }
}