// src/app/chuyen-de/chuyen-de-list/chuyen-de-list.component.ts
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { of, switchMap } from 'rxjs';
import { get } from 'lodash';
import { stsBoSuuTapDsChuyenDeService } from '../stsBoSuuTapDs-chuyen-de.service';
import { IChuyenDe, IChuyenDeResponse } from '../stsBoSuuTapDs-chuyen-de.type';
import { SortByCapPipe } from '../stsBoSuuTapDs-sort-by-cap.pipe';
import { LoaderService } from '@/app/shared/services/loader.service';
import { SeoService } from '@/app/core/services/seo/seo.service';
import { SafeHtmlPipe } from '@/app/shared/Pipes/safe-html.pipe';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { environment } from 'environments/environment';
import { SharedService } from '@/app/shared/services/shared.service';
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
    NzIconModule,
    NzPopoverModule,
    NzButtonModule,
    NzBadgeModule,
    NzModalModule,
    TranslateModule,
    NzSelectModule
  ],
  templateUrl: './stsBoSuuTapDs-chuyen-de-list.component.html',
  styleUrls: ['./stsBoSuuTapDs-chuyen-de-list.component.scss'],
  providers: [stsBoSuuTapDsChuyenDeService]
})
export class stsBoSuuTapDsChuyenDeListComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private seoService: SeoService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  chuyenDeService = inject(stsBoSuuTapDsChuyenDeService);
  sharedService = inject(SharedService);
  chuyenDeList: any = []; // khởi tạo rỗng, sẽ gán sau trong searchChuyenDe

  searchTerm = '';
  pageIndex = 1;
  pageSize = environment.PAGE_SIZE;
  itemPerpageOption = environment.ITEM_PER_PAGE_OPTION;
  totalRecord = 0;
  

  ngOnInit(): void {
    this.loaderService.setLoading(true);
    this.searchChuyenDe();
  }

  searchChuyenDe(): void {
  this.chuyenDeList = this.chuyenDeService.getChuyenDeList({
    tieuDe: this.searchTerm,
    pageIndex: this.pageIndex - 1,
    pageSize: this.pageSize,
    bsThuvienId: this.sharedService.thuVienId
  }).pipe(
    switchMap((res) => {
      console.log('🚀 ~ searchChuyenDe ~ res:', res);
      if (res.messageCode === 1) {
        this.totalRecord = res.totalRecord || 0;

        // Chỉ lấy stsBoSuuTapId === "0"
        const filteredData = (get(res, 'data', []) || []).filter(item => item.stsBoSuuTapId === "0");

        return of(filteredData);
      }
      return of([]); // dùng of để Observable không bị lỗi
    })
  );

  this.changeDetectorRef.detectChanges();
}


  onPageChange(page: number): void {
    this.pageIndex = page;
    this.searchChuyenDe();
  }

  handleChangePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.pageIndex = 1; // quay về trang đầu tiên
    this.searchChuyenDe();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecord / this.pageSize) || 1;
  }

  getImageUrl(chuyenDe: IChuyenDe): string {
    return chuyenDe.anhDaiDien || 'https://via.placeholder.com/250x167?text=No+Image';
  }

  getDescription(chuyenDe: IChuyenDe): string {
    return chuyenDe.moTa || this.translate.instant('no_description');
  }

  onSearchChange(): void {
    this.pageIndex = 1;
    this.searchChuyenDe();
  }
}