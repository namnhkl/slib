import { Component, inject } from '@angular/core';
import { VbqpPhapLuatService } from './vbqp-phap-luat.service';
import { AsyncPipe } from '@angular/common';
import { catchError, debounceTime, finalize, of, Subject, switchMap, tap } from 'rxjs';
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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@Component({
  selector: 'app-vbqp-phap-luat',
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
    NzDividerModule,
    NzModalModule,
    NzCollapseModule
  ],
  templateUrl: './vbqp-phap-luat.component.html',
  styleUrl: './vbqp-phap-luat.component.scss',
  providers: [VbqpPhapLuatService]
})
export class VbqpPhapLuatComponent {
  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer,) { }

  isLoading = true;
  readonly URL_DETAIL = URL_ROUTER.QtndTinTucChiTiet;

  VbqpPhapLuatService = inject(VbqpPhapLuatService);
  sharedService = inject(SharedService);

  pageIndex = 1;
  pageSizes = 6;
  sizeItems = environment.ITEM_PER_PAGE_OPTION;
  totalPages = 0;
  VbqpPhapLuats: any[] = [];
  loaiVanBanList: any[] = [];
  VbqpPhapLuatsMostViewed: any[] = [];
  loaiVanBanIdId = '';
  searchKeyword = '';
  searchKeywordChanged = new Subject<string>();
  isVisible = false;
  VbqpPhapLuatDetail: any = {};
  safeContent: SafeHtml = '';
  currentUrl: string = '';
  encodedUrl: string = '';
  encodedTitle: string = '';

  getVbqpPhapLuats() {
    this.isLoading = true;

    this.VbqpPhapLuatService.qtndNvVanBan({
      qtndDmLoaiVanBanId: this.loaiVanBanIdId,
      ten: this.searchKeyword?.trim(),
      bsThuVienId: this.sharedService.thuVienId,
      pageIndex: this.pageIndex - 1,
      pageSize: this.pageSizes
    })
      .pipe(
        tap((res) => {
          // console.log('Response: ', res);
          if (res.messageCode === 1) {
            this.VbqpPhapLuats = Array.isArray(res.data)
              ? res.data.map(item => ({ ...item }))
              : [];
            this.totalPages = Math.ceil((res.totalRecord ?? 0) / this.pageSizes);
          } else {
            this.VbqpPhapLuats = [];
          }
        }),
        catchError((error) => {
          console.error('Lỗi khi tải dữ liệu:', error);
          this.VbqpPhapLuats = [];
          return of(null); // Trả về observable để tiếp tục chuỗi
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  getLoaiVanBan() {
    this.isLoading = true;

    this.VbqpPhapLuatService.qtndDmLoaiVanBan({})
      .pipe(
        tap((res) => {
          // console.log('Response: ', res);
          if (res.messageCode === 1) {
            this.loaiVanBanList = Array.isArray(res.data)
              ? res.data.map(item => ({ ...item }))
              : [];
            this.totalPages = Math.ceil((res.totalRecord ?? 0) / this.pageSizes);
          } else {
            this.loaiVanBanList = [];
          }
        }),
        catchError((error) => {
          console.error('Lỗi khi tải dữ liệu:', error);
          this.loaiVanBanList = [];
          return of(null); // Trả về observable để tiếp tục chuỗi
        }),
        finalize(() => {
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
    this.getVbqpPhapLuats();
  }

  onSearchDebounce(value: string) {
    this.searchKeywordChanged.next(value);
  }
  onSearch() {
    this.pageIndex = 1;
    this.getVbqpPhapLuats();
  }


  onPageChange(type: 'next' | 'prev') {
    if (type === 'next' && this.pageIndex < this.totalPages) this.pageIndex++;
    else if (type === 'prev' && this.pageIndex > 1) this.pageIndex--;
    this.getVbqpPhapLuats();
  }

  onPageSizeChange(size: number) {
    this.pageSizes = +size;
    this.pageIndex = 1;
    this.getVbqpPhapLuats();

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


  getChiTietVanBan(id: string) {
    this.VbqpPhapLuatService.chiTietVanBan({ id, bsThuVienId: this.sharedService.thuVienId }).subscribe((res) => {
      if (res.messageCode === 1) {
        this.VbqpPhapLuatDetail = _.get(res, 'data.0', {});
        // console.log('VbqpPhapLuatDetail', this.VbqpPhapLuatDetail);
        const noiDungRaw = _.get(res, 'data.0.noiDung', '');
        this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
        // console.log('nd: ', this.safeContent);
        this.currentUrl = window.location.href;
        this.encodedUrl = encodeURIComponent(this.currentUrl);
        this.encodedTitle = encodeURIComponent(this.VbqpPhapLuatDetail?.ten ?? '');
      }
    });
  }

  ngOnInit(): void {
    // Lắng nghe thay đổi query params
    this.route.queryParams.subscribe(params => {
      this.loaiVanBanIdId = params['loaiVanBanIdId'] || '';
      // console.log('loaiVanBanIdId:', this.loaiVanBanIdId);
    });
    this.getLoaiVanBan();
    // Gọi dữ liệu ban đầu
    this.getVbqpPhapLuats();

    // Đăng ký debounce khi searchKeyword thay đổi
    this.searchKeywordChanged.pipe(
      debounceTime(500) // đợi 500ms sau khi ngừng gõ
    ).subscribe(value => {
      this.searchKeyword = value;
      this.onSearch();
    });
  }

  showModal(id: string): void {
  this.VbqpPhapLuatService.chiTietVanBan({ id, bsThuVienId: this.sharedService.thuVienId }).subscribe((res) => {
    if (res.messageCode === 1) {
      this.VbqpPhapLuatDetail = _.get(res, 'data.0', {});
      const noiDungRaw = _.get(res, 'data.0.noiDung', '');
      this.safeContent = this.sanitizer.bypassSecurityTrustHtml(noiDungRaw);
      this.currentUrl = window.location.href;
      this.encodedUrl = encodeURIComponent(this.currentUrl);
      this.encodedTitle = encodeURIComponent(this.VbqpPhapLuatDetail?.ten ?? '');

      // ✅ Mở modal sau khi dữ liệu đã sẵn sàng
      this.isVisible = true;
    }
  });
}


  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
