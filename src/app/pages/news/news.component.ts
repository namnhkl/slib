import { Component, inject } from '@angular/core';
import { NewsService } from './news.service';
import { AsyncPipe } from '@angular/common';
import { of, switchMap, tap } from 'rxjs';
// eslint-disable-next-line id-length
import _ from 'lodash';
import { RouterLink, RouterModule } from '@angular/router';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  imports: [
    AsyncPipe,
    RouterLink,
    RouterModule,
    NzSpinModule,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  providers: [NewsService]
})
export class NewsComponent {
  isLoading = true;
  readonly URL_DETAIL = URL_ROUTER.newDetail;

  newService = inject(NewsService);
  
  pageIndex = 1;
  pageSize = 5;
  totalPages = 0;
  newsData: any[] = [];
  newsDataMostViewed: any[] = [];
  
  getNewsData() {
    this.isLoading = true;

    // ✅ truyền pageIndex - 1 nếu API yêu cầu 0-based
    this.newService.getNews(this.pageIndex - 1, this.pageSize).pipe(
      tap(res => {
        if (res.messageCode === 1) {
          this.newsData = Array.isArray(res.data) ? res.data : [];

          // ✅ tính tổng số trang đúng
          this.totalPages = Math.ceil((res.totalRecord ?? 1) / this.pageSize);
        } else {
          this.newsData = [];
        }

        this.isLoading = false;
      })
    ).subscribe();
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
    this.pageSize = +size;
    this.pageIndex = 1;
    this.getNewsData();
    
  }

  ngOnInit(): void {
    this.getNewsData();
    this.getTopNewsData();
  }
}
