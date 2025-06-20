import { AfterViewInit, Component, ElementRef, OnInit, Pipe, ViewChild } from '@angular/core';
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
import { SafeUrlPipe } from '@/app/shared/Pipes/safe-url.pipe';

interface ISimpleItem {
  id: string;
  title: string;
  moTa?: string;
  ngayDangTin?: string;
  audios?: { url: string; name: string }[];
  videos?: { url: string; name: string }[];
  anhDaiDien?: string;
  noiDung?: string;
  tacGia?: string;
  slXem?: number;
}


@Component({
  selector: 'app-media-library',
  templateUrl: './MediaLibrary.component.html',
  styleUrls: ['./MediaLibrary.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,NzPaginationModule,TranslateModule,SafeUrlPipe],
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

export class MediaLibraryComponent implements OnInit, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private tintucService: QtndTinTucService,
    private shareService: SharedService,
    public sanitizer: DomSanitizer
  ) {}
@ViewChild('audioRef') audioRef!: ElementRef<HTMLAudioElement>;
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

currentAudioIndex = 0;

selectAudio(index: number) {
  this.currentAudioIndex = index;
  const audioElement = document.querySelector('audio');
  audioElement?.load();
  audioElement?.play();
}

// Tự động phát bài tiếp theo khi bài hiện tại kết thúc
ngAfterViewInit() {
  const audio = document.querySelector('audio');
  if (audio) {
    audio.addEventListener('ended', () => {
      this.playNextAudio();
    });
  }
}

playNextAudio() {
  if (!this.selectedItem?.audios?.length) return;
  this.currentAudioIndex = (this.currentAudioIndex + 1) % this.selectedItem.audios.length;
  const audioElement = document.querySelector('audio');
  audioElement?.load();
  audioElement?.play();
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
      console.log('serviceCalls',responses);
      const mergedItems = responses.flatMap((res) => res?.data || []);
      mergedItems.sort((a, b) => new Date(b.ngayDangTin).getTime() - new Date(a.ngayDangTin).getTime());
      console.log('mergedItems',mergedItems);
      const detailRequests = mergedItems.map((item) => {
        const detailParams = {
          pageIndex: 0,
          pageSize: 9999999,
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
              console.log('itemDetail',itemDetail);
            const groupItems = itemDetail.map((chiTiet: IChiTietTinTuc, index: number): ISimpleItem | null => {
  const videos: { name: string; url: string; isYoutube?: boolean }[] = [];
const audios: { name: string; url: string }[] = [];

for (let i = 1; i <= 5; i++) {
  const fileUrl = (chiTiet as any)[`tepTin0${i}DuongDan`]?.trim();
  const fileName = (chiTiet as any)[`tepTin0${i}Ten`]?.trim() || '';
  if (!fileUrl) continue;

  const fixedUrl = this.normalizeUrl(fileUrl);
  const lowerName = fileName.toLowerCase();

  // Nếu là video YouTube
  if (chiTiet.laTinVideo === 1 && chiTiet.laTinVideoYoutube === 1) {
    videos.push({ name: fileName || `YouTube ${i}`, url: fixedUrl, isYoutube: true });
  }
  // Nếu là video file
  else if (lowerName.endsWith('.mp4') || lowerName.endsWith('.mov') || lowerName.endsWith('.avi') || lowerName.endsWith('.mkv')) {
    videos.push({ name: fileName, url: fixedUrl });
  }
  // Nếu là audio
  else if (lowerName.endsWith('.mp3') || lowerName.endsWith('.wav') || lowerName.endsWith('.ogg')) {
    audios.push({ name: fileName, url: fixedUrl });
  }
}


  if (videos.length === 0 && audios.length === 0) return null;

  const commonData = {
    id: chiTiet.id,
    title: chiTiet.ten || `MEDIA ${groupIndex + 1}-${index + 1}`,
    ngayDangTin: chiTiet.ngayDangTin,
    moTa: chiTiet.moTa || '',
    noiDung: chiTiet.noiDung,
    slXem: chiTiet.slXem,
    tacGia: chiTiet.tacGia,
    anhDaiDien: chiTiet.anhDaiDien?.trim() || (videos.length > 0 ? '/img/default-video.png' : '/img/default-audio.png'),
  };

  return {
    ...commonData,
    audios,
    videos,
  };
}).filter((item): item is ISimpleItem => item !== null);


            allItems.push(...groupItems);
          });

          this.simpleData = allItems;
          this.applySearchFilter();

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
        }
      });
    },
    error: (err) => {
      console.error('🔥 Lỗi khi tải danh sách:', err);
    }
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

    if (this.audioRef?.nativeElement) {
      this.audioRef.nativeElement.pause();
      this.audioRef.nativeElement.currentTime = 0;
    }

    this.selectedItem = { ...item };
    this.currentAudioIndex = 0;

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
transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
