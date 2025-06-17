import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QtndTinTucService } from '@/app/shared/services/QtndTinTuc.service';
import { SharedService } from '@/app/shared/services/shared.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { debounceTime, forkJoin, Observable, Subject } from 'rxjs';
import { IChiTietTinTuc } from '@/app/shared/types/tintuc';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';

interface ISimpleItem {
  id: string;
  title: string;
  moTa?: string;
  ngayDangTin?: string;
  audio?: SafeResourceUrl;
  video?: SafeResourceUrl;
  anhDaiDien?: string;
}

@Component({
  selector: 'app-media-library',
  templateUrl: './MediaLibrary.component.html',
  styleUrls: ['./MediaLibrary.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,NzPaginationModule,TranslateModule],
    animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' })),
      ]),
    ]),
  ],
})
export class MediaLibraryComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tintucService: QtndTinTucService,
    private shareService: SharedService,
    public sanitizer: DomSanitizer
  ) {}

  type: 'video' | 'audio' | null = null;
  pageIndex = 1; // bắt đầu từ 1
pageSize = 6;
searchTerm = '';
filteredData: ISimpleItem[] = [];
pagedData: ISimpleItem[] = [];
simpleData: ISimpleItem[] = [];

selectedItem: ISimpleItem | null = null;
searchChanged = new Subject<string>();
  ngOnInit(): void {
  this.route.queryParams.subscribe((params) => {
    const typeParam = params['type'];
    const idParam = params['id'];

    this.type = typeParam === 'video' || typeParam === 'audio' ? typeParam : null;

    this.loadDocuments(idParam); // Truyền id vào loadDocuments
  });

  this.searchChanged.pipe(debounceTime(300)).subscribe((term) => {
    this.searchTerm = term;
    this.applySearchFilter();
  });
}


  loadDocuments(selectedId?: string): void {
  const requestParams = {
    pageIndex: 0,
    pageSize: 99999,
    bsThuvienId: this.shareService.thuVienId,
    ten: '',
  };

  let serviceCalls: Observable<any>[];

  if (!this.type) {
    serviceCalls = [
      this.tintucService.qtndTtTinTucVideo(requestParams),
      this.tintucService.qtndTtTinTucAudio(requestParams),
    ];
  } else {
    serviceCalls = [
      this.type === 'video'
        ? this.tintucService.qtndTtTinTucVideo(requestParams)
        : this.tintucService.qtndTtTinTucAudio(requestParams),
    ];
  }

  forkJoin(serviceCalls).subscribe({
    next: (responses) => {
      const mergedItems = responses.flatMap((res) => res?.data || []);
      mergedItems.sort((a, b) => new Date(b.ngayDangTin).getTime() - new Date(a.ngayDangTin).getTime());

      const detailRequests = mergedItems.map((item) => {
        const detailParams = {
          pageIndex: 0,
          pageSize: 1,
          bsThuvienId: this.shareService.thuVienId,
          id: item.id,
        };

        return item.laTinVideoYoutube === 1 || item.laTinVideo === 1
          ? this.tintucService.qtndTtTinTucVideo(detailParams)
          : this.tintucService.qtndTtTinTucAudio(detailParams);
      });

      forkJoin(detailRequests).subscribe({
        next: (details) => {
          const allItems: ISimpleItem[] = [];

          details.forEach((res: any, groupIndex: number) => {
            const itemDetail: IChiTietTinTuc[] = res?.data ?? [];

            const groupItems = itemDetail
              .map((chiTiet: IChiTietTinTuc, index: number): ISimpleItem | null => {
                const rawUrl = chiTiet.tepTin01DuongDan?.trim() || '';
                if (!rawUrl) return null;

                const fixedUrl = this.normalizeUrl(rawUrl);
                const isVideo = chiTiet.laTinVideoYoutube === 1 || chiTiet.laTinVideo === 1;

                const commonData = {
                  id: chiTiet.id,
                  title: chiTiet.ten || `MEDIA ${groupIndex + 1}-${index + 1}`,
                  ngayDangTin: chiTiet.ngayDangTin,
                  moTa: chiTiet.moTa || '',
                  noiDung: chiTiet.noiDung,
                  slXem: chiTiet.slXem,
                  tacGia:chiTiet.tacGia,
                  anhDaiDien: chiTiet.anhDaiDien?.trim() || (isVideo ? '/img/default-video.png' : '/img/default-audio.png'),
                };

                return isVideo
                  ? { ...commonData, video: this.sanitizer.bypassSecurityTrustResourceUrl(fixedUrl) }
                  : { ...commonData, audio: this.sanitizer.bypassSecurityTrustResourceUrl(fixedUrl) };
              })
              .filter((item): item is ISimpleItem => item !== null);

            allItems.push(...groupItems);
          });

          this.simpleData = allItems;
          this.applySearchFilter();

          // 👉 Nếu có ID được truyền qua query params, tìm và tự động hiển thị
          if (selectedId) {
            const found = this.simpleData.find(item => item.id === selectedId);
            if (found) {
              this.selectItem(found);
            }
          }
        },
        error: (err) => {
          console.error('🔥 Lỗi khi load chi tiết:', err);
          this.simpleData = [];
        },
      });
    },
    error: (err) => {
      console.error('🔥 Lỗi khi tải danh sách:', err);
    },
  });
}


  normalizeUrl(url: string): string {
    return url.replace(/\\\\/g, '/').replace(/\\/g, '/').replace(/^https?:\/(?!\/)/, (m) => m + '/');
  }

applySearchFilter(): void {
  const term = this.searchTerm.toLowerCase().trim();
  if (!term) {
    this.filteredData = [...this.simpleData];
  } else {
    this.filteredData = this.simpleData.filter(
      (item) =>
        item.title?.toLowerCase().includes(term) ||
        item.moTa?.toLowerCase().includes(term)
    );
  }

  this.pageIndex = 1;
  this.updatePagedData();
}
updatePagedData(): void {
  const start = (this.pageIndex - 1) * this.pageSize;
  const end = start + this.pageSize;
  this.pagedData = this.filteredData.slice(start, end);
}

  setType(type: 'video' | 'audio' | null) {
    this.selectedItem = null;
    this.type = type;
    this.loadDocuments();
  }

  selectItem(item: ISimpleItem): void {
    this.selectedItem = item;
    setTimeout(() => {
      document.getElementById('mediaViewer')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  closeViewer(): void {
    this.selectedItem = null;
  }



  onPageIndexChange(index: number): void {
  this.pageIndex = index;
  this.updatePagedData();
}

onPageSizeChange(size: number): void {
  this.pageSize = size;
  this.pageIndex = 1;
  this.updatePagedData();
}

}
