import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { get } from 'lodash';
import { ChuyenDeService } from '../chuyen-de.service';
import { IChuyenDeResponse } from '../chuyen-de.type';
import { SortByCapPipe } from '../sort-by-cap.pipe';
import { LoaderService } from '@/app/shared/services/loader.service';
import { SeoService } from '@/app/core/services/seo/seo.service';
import { SafeHtmlPipe } from '@/app/shared/Pipes/safe-html.pipe';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { PreviewDocumentComponent } from 'app/pages/documents/preview-document/preview-document.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { TranslateModule } from '@ngx-translate/core';
import { IDocument } from '@/app/pages/documents/documents';
import { ActivatedRoute } from '@angular/router';
import { NzSelectModule } from 'ng-zorro-antd/select';

interface TacGia {
  giaTri: string;
}

@Component({
  selector: 'app-chuyen-de-item',
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
    PreviewDocumentComponent,
    NzModalModule,
    TranslateModule,
    NzSelectModule 
  ],
  templateUrl: './chuyen-de-item.component.html',
  styleUrls: ['./chuyen-de-item.component.scss'],
  providers: [ChuyenDeService],
})
export class ChuyenDeItemComponent implements OnInit {
  constructor(
    private seoService: SeoService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  chuyenDeService = inject(ChuyenDeService);

  searchTerm = '';
  stsBoSuuTapId = '';
  tenChuyenDe = '';
  pageIndex = 1;
  pageSize = 10;
  totalRecord = 0;

  // Sử dụng BehaviorSubject để quản lý danh sách chuyên đề
  private chuyenDeListSubject = new BehaviorSubject<IDocument[]>([]);
  chuyenDeList$ = this.chuyenDeListSubject.asObservable();

  ngOnInit(): void {
    console.log('🚀 ~ ChuyenDeItemComponent ~ ngOnInit');
    this.loaderService.setLoading(true);

    // Lấy tham số từ URL
    this.route.queryParams.subscribe((params) => {
      this.stsBoSuuTapId = params['stsBoSuuTapId'] || '';
      this.searchTerm = params['tieuDe'] || '';
      this.pageIndex = parseInt(params['pageIndex'], 10) || 1;
      this.pageSize = parseInt(params['pageSize'], 10) || 10;

      // Kiểm tra stsBoSuuTapId
      if (!this.stsBoSuuTapId) {
        console.warn('stsBoSuuTapId is required but not provided in URL');
        this.chuyenDeListSubject.next([]);
        this.loaderService.setLoading(false);
        this.changeDetectorRef.detectChanges();
        return;
      }

      // Lấy tên chuyên đề
      this.chuyenDeService
        .getChuyenDeById({ id: this.stsBoSuuTapId })
        .pipe(
          switchMap((res) => {
            console.log('🚀 ~ getChuyenDeById ~ res:', res);
            if (res.messageCode === 1) {
              const data = get(res, 'data', []);
              return of(data.length > 0 ? data[0].ten : '');
            }
            return of('');
          })
        )
        .subscribe((ten) => {
          this.tenChuyenDe = ten;
          this.changeDetectorRef.detectChanges();
        });

      // Tải danh sách chuyên đề
      this.searchChuyenDeItem();
    });
  }

  searchChuyenDeItem(): void {
    if (!this.stsBoSuuTapId) {
      console.warn('Cannot search without stsBoSuuTapId');
      this.chuyenDeListSubject.next([]);
      this.loaderService.setLoading(false);
      this.changeDetectorRef.detectChanges();
      return;
    }

    // Reset pageIndex về 1 khi tìm kiếm mới
    if (this.searchTerm) {
      this.pageIndex = 1;
    }

    this.loaderService.setLoading(true);
    this.chuyenDeService
      .getChuyenDeItem({
        stsBoSuuTapId: this.stsBoSuuTapId,
        tieuDe: this.searchTerm,
        pageIndex: this.pageIndex - 1,
        pageSize: this.pageSize,
      })
      .pipe(
        switchMap((res) => {
          console.log('🚀 ~ ChuyenDeItemComponent ~ searchChuyenDeItem ~ res:', res);
          if (res.messageCode === 1) {
            this.totalRecord = res.totalRecord || 0;
            return of(get(res, 'data', []));
          }
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.chuyenDeListSubject.next(data); // Cập nhật danh sách
          this.loaderService.setLoading(false);
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('API error:', err);
          this.chuyenDeListSubject.next([]);
          this.loaderService.setLoading(false);
          this.changeDetectorRef.detectChanges();
        },
      });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.searchChuyenDeItem();
  }

  handleChangePageSize(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.searchChuyenDeItem();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecord / this.pageSize);
  }

  getImageUrl(chuyenDe: IDocument): string {
    return chuyenDe.anhDaiDien || 'https://via.placeholder.com/250x167?text=No+Image';
  }

  getTacGiaString(tacGia: TacGia[]): string {
    return tacGia?.map((item) => item.giaTri).join(', ') || '';
  }
}