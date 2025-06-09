/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable id-length */
import { Component, inject } from '@angular/core';
import { QtndTinTucService } from './QtndTinTuc.service';
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

@Component({
  selector: 'app-qtndtintuc',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterModule,
    NzSpinModule,
    TranslateModule,
    CommonModule,
    FormsModule,
    NzSelectModule
  ],
  templateUrl: './QtndTinTuc.component.html',
  styleUrl: './QtndTinTuc.component.scss',
  providers: [QtndTinTucService]
})
export class QtndTinTucComponent {
  constructor(private route: ActivatedRoute) {}

  isLoading = true;
  readonly URL_DETAIL = URL_ROUTER.QtndTinTucChiTiet;

  newService = inject(QtndTinTucService);
  
  pageIndex = 1;
  pageSizes = environment.PAGE_SIZE;
  sizeItems = environment.ITEM_PER_PAGE_OPTION;
  totalPages = 0;
  newsData: any[] = [];
  newsDataMostViewed: any[] = [];
  qtndTtNhomTinTucId = '';
  searchKeyword = '';
  searchKeywordChanged = new Subject<string>();
  
  getNewsData() {
  this.isLoading = true;
  this.newService.getNews(this.pageIndex - 1, this.pageSizes, {
    qtndTtNhomTinTucId: this.qtndTtNhomTinTucId,
    ten: this.searchKeyword.trim()
  }).pipe(
    tap(res => {
      console.log('dddd: ', res);
      if (res.messageCode === 1) {
        this.newsData = Array.isArray(res.data) ? res.data : [];
        this.totalPages = Math.ceil((res.totalRecord ?? 1) / this.pageSizes);
      } else {
        this.newsData = [];
      }
      this.isLoading = false;
    })
  ).subscribe();
}
onSearchDebounce(value: string) {
  this.searchKeywordChanged.next(value);
}
onSearch() {
  this.pageIndex = 1;
  this.getNewsData();
}
 getTopNewsData() {
  this.newService.getNews(0, 9999).pipe(
    tap(res => {
      if (res.messageCode === 1) {
        // ✅ Lọc top 5 tin có nhiều lượt xem nhất
        this.newsDataMostViewed = (Array.isArray(res.data) ? res.data : [])
          .sort((a, b) => (b.slXem || 0) - (a.slXem || 0))
          .slice(0, 5);
      } else {
        this.newsDataMostViewed = [];
      }
    })
  ).subscribe();
}

  onPageChange(type: 'next' | 'prev') {
    if (type === 'next' && this.pageIndex < this.totalPages) this.pageIndex++;
    else if (type === 'prev' && this.pageIndex > 1) this.pageIndex--;
    this.getNewsData();
  }

  onPageSizeChange(size: number) {
    this.pageSizes = +size;
    this.pageIndex = 1;
    this.getNewsData();
    
  }
  
ngOnInit(): void {
  // Lắng nghe thay đổi query params
  this.route.queryParams.subscribe(params => {
    this.qtndTtNhomTinTucId = params['qtndTtNhomTinTucId'] || '';
    console.log('qtndTtNhomTinTucId:', this.qtndTtNhomTinTucId);
  });

  // Gọi dữ liệu ban đầu
  this.getTopNewsData();
  this.getNewsData();

  // Đăng ký debounce khi searchKeyword thay đổi
  this.searchKeywordChanged.pipe(
    debounceTime(500) // đợi 500ms sau khi ngừng gõ
  ).subscribe(value => {
    this.searchKeyword = value;
    this.onSearch();
  });
}
}
