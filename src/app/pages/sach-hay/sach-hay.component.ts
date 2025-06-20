/* eslint-disable newline-before-return */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable id-length */
import { Component, inject } from '@angular/core';
import { SachHayService } from './sach-hay.service';
import { AsyncPipe } from '@angular/common';
import { debounceTime, of, Subject, switchMap, tap } from 'rxjs';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'environments/environment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { SharedService } from '@/app/shared/services/shared.service';
import { SachHayCarouselComponent } from './sach-hay-carousel/sach-hay-carousel.component';

@Component({
  selector: 'app-sach-hay',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterModule,
    NzSpinModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzPaginationModule,
    SachHayCarouselComponent
  ],
  templateUrl: './sach-hay.component.html',
  styleUrl: './sach-hay.component.scss',
  providers: [SachHayService]
})
export class SachHayComponent {
  constructor(private route: ActivatedRoute) {}

  isLoading = true;
  readonly URL_DETAIL = URL_ROUTER.sachhaychitiet;

  sachHayService = inject(SachHayService);
  sharedService = inject(SharedService);
  
  pageIndex = 1;
  pageSizes = environment.PAGE_SIZE;
  sizeItems = environment.ITEM_PER_PAGE_OPTION;
  totalPages = 0;
  sachHaysData: any[] = [];
  qtndDmLoaiThuMucId = '';
  searchKeyword = '';
  searchKeywordChanged = new Subject<string>();
  
  getsachHaysData() {
  this.isLoading = true;
  this.sachHayService
    .getDanhMucSachHay({
      pageIndex:this.pageIndex - 1,
      pageSize:this.pageSizes,
      qtndDmLoaiThuMucId: this.qtndDmLoaiThuMucId,
      ten: this.searchKeyword.trim(),
      bsThuVienId:  this.sharedService.thuVienId
    })
    .pipe(
      tap((res) => {
        if (res.messageCode === 1) {
          this.sachHaysData = Array.isArray(res.data)
            ? res.data.map((item) => ({
                ...item,
                ngayDangTin: this.parseDate(item.ngayDangTin),
              }))
            : [];
          this.totalPages = Math.ceil((res.totalRecord ?? 1) / this.pageSizes);
        } else {
          this.sachHaysData = [];
        }
        this.isLoading = false;
      })
    )
    .subscribe();
}

// Hàm hỗ trợ chuyển đổi chuỗi ngày DD/MM/YYYY thành Date
private parseDate(dateString: string): Date | null {
  if (!dateString) return null;
  try {
    const [day, month, year] = dateString.split('/').map(Number);
    // Kiểm tra xem ngày có hợp lệ không
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return null;
    }
    const date = new Date(year, month - 1, day); // month - 1 vì tháng trong Date bắt đầu từ 0
    // Kiểm tra xem Date có hợp lệ không
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

// Handle page index change
  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.getsachHaysData();
  }

onSearchDebounce(value: string) {
  this.searchKeywordChanged.next(value);
}
onSearch() {
  this.pageIndex = 1;
  this.getsachHaysData();
}

  onPageChange(type: 'next' | 'prev') {
    if (type === 'next' && this.pageIndex < this.totalPages) this.pageIndex++;
    else if (type === 'prev' && this.pageIndex > 1) this.pageIndex--;
    this.getsachHaysData();
  }

  onPageSizeChange(size: number) {
    this.pageSizes = +size;
    this.pageIndex = 1;
    this.getsachHaysData();
    
  }
  
  getPageNumbers(): number[] {
  const maxPagesToShow = 9;
  const pages: number[] = [];
  const startPage = Math.max(1, this.pageIndex - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
return pages;
}

ngOnInit(): void {
  // Lắng nghe thay đổi query params
  this.route.queryParams.subscribe(params => {
    this.qtndDmLoaiThuMucId = params['qtndDmLoaiThuMucId'] || '';
    
  });

  // Gọi dữ liệu ban đầu
  this.getsachHaysData();

  // Đăng ký debounce khi searchKeyword thay đổi
  this.searchKeywordChanged.pipe(
    debounceTime(500) // đợi 500ms sau khi ngừng gõ
  ).subscribe(value => {
    this.searchKeyword = value;
    this.onSearch();
  });
}

changePageSize(size: number) {
  this.pageSizes = +size;
  this.pageIndex = 1;
  this.getsachHaysData();
}

prevPage() {
  if (this.pageIndex > 1) {
    this.pageIndex--;
    this.getsachHaysData();
  }
}

nextPage() {
  if (this.pageIndex < this.totalPages) {
    this.pageIndex++;
    this.getsachHaysData();
  }
}

}
