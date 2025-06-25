import { AfterViewInit, Component, ElementRef, OnInit, Pipe, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
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
    public sanitizer: DomSanitizer,
    private location: Location,
    private router: Router
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

currentAudioIndex = 0;
isPlaying = false;
isLooping = false;
duration = 0;
currentTime = 0;
playbackRate = 1;
volume: number = 1; // mặc định 100%

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


selectAudio(index: number): void {
  this.currentAudioIndex = index;
  
  // Reset playback speed and volume
  this.playbackRate = 1;
  this.volume = 1;

  // Cập nhật playback rate và volume cho audio element
  if (this.audioRef?.nativeElement) {
    this.audioRef.nativeElement.playbackRate = this.playbackRate;
    this.audioRef.nativeElement.volume = this.volume;
  }

  this.playAudio();
}

ngAfterViewInit() {
  const audio = this.audioRef?.nativeElement;
  if (audio) {
    audio.addEventListener('ended', () => {
      if (this.isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        this.playNextAudio();
      }
    });
    setTimeout(() => {
  if (this.audioRef?.nativeElement) {
    this.audioRef.nativeElement.volume = this.volume;
  }
}, 0);
  }
}

changeVolume(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.volume = parseFloat(input.value);
  if (this.audioRef?.nativeElement) {
    this.audioRef.nativeElement.volume = this.volume;
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
      // console.log('serviceCalls',responses);
      const mergedItems = responses.flatMap((res) => res?.data || []);
      mergedItems.sort((a, b) => new Date(b.ngayDangTin).getTime() - new Date(a.ngayDangTin).getTime());
      // console.log('mergedItems',mergedItems);
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
              // console.log('itemDetail',itemDetail);
            const groupItems = itemDetail.map((chiTiet: IChiTietTinTuc, index: number): ISimpleItem | null => {
  const videos: { name: string; url: string; isYoutube?: boolean }[] = [];
const audios: { name: string; url: string, image?:string }[] = [];

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
    audios.push({ name: fileName, url: fixedUrl, image: chiTiet.anhDaiDien?.trim() || '' });
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
    anhDaiDien: chiTiet.anhDaiDien?.trim() || (videos.length > 0 ? './assets/img/default-video.png' : './assets/img/default-audio.png'),
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
  this.isPlaying = false;
  this.isLooping = false;

  // Reset playback speed and volume
  this.playbackRate = 1;
  this.volume = 1;

  // Dừng và reset audio nếu tồn tại
  if (this.audioRef?.nativeElement) {
    this.audioRef.nativeElement.pause();
    this.audioRef.nativeElement.currentTime = 0;
    this.audioRef.nativeElement.playbackRate = this.playbackRate; // Reset playback rate
    this.audioRef.nativeElement.volume = this.volume; // Reset volume
  }

  // Gán item và reset index
  this.selectedItem = { ...item };
  this.currentAudioIndex = 0;

  // Cập nhật ID trên URL
  const currentUrl = this.router.url.split('?')[0];
  this.location.replaceState(currentUrl, `id=${item.id}`);

  // Scroll và set volume sau khi audioRef đã render đúng
  setTimeout(() => {
    // Cuộn tới vùng phát
    document.getElementById('mediaViewer')?.scrollIntoView({ behavior: 'smooth' });

    // Đặt lại âm lượng
    if (this.audioRef?.nativeElement) {
      this.audioRef.nativeElement.volume = this.volume;
      this.audioRef.nativeElement.playbackRate = this.playbackRate;
    }
  }, 100); // Đảm bảo DOM đã cập nhật xong
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

  togglePlayPause(): void {
  const audio = this.audioRef?.nativeElement;
  // console.log('togglePlayPause', audio);
  if (!audio) return;

  if (this.isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }

  this.isPlaying = !this.isPlaying;
}

toggleLoop(): void {
  this.isLooping = !this.isLooping;
  const audio = this.audioRef?.nativeElement;
  if (audio) {
    audio.loop = this.isLooping;
  }
}

prevAudio(): void {
  if (this.currentAudioIndex > 0) {
    this.currentAudioIndex--;
    this.playAudio();
  }
}

nextAudio(): void {
  if (this.selectedItem?.audios && this.currentAudioIndex < this.selectedItem.audios.length - 1) {
    this.currentAudioIndex++;
    this.playAudio();
  }
}



playAudio(): void {
  const audio = this.audioRef?.nativeElement;
  if (audio) {
    audio.load();

    // Đặt lại âm lượng từ biến volume hiện tại
    audio.volume = this.volume ?? 1;

    audio.play().catch(() => {});
    this.isPlaying = true;
  }
}


updateProgress(): void {
  const audio = this.audioRef?.nativeElement;
  if (audio) {
    this.currentTime = audio.currentTime;
  }
}

updateDuration(): void {
  const audio = this.audioRef?.nativeElement;
  if (audio) {
    this.duration = audio.duration || 0;
  }
}

handleAudioEnd(): void {
  if (this.isLooping) {
    this.playAudio(); // replay same
  } else if (this.selectedItem?.audios && this.currentAudioIndex < this.selectedItem.audios.length - 1) {
    this.currentAudioIndex++;
    this.playAudio();
  } else {
    this.isPlaying = false; // stop at the end
  }
}

formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

changePlaybackRate(rate: number): void {
  const audio = this.audioRef?.nativeElement;
  if (audio) {
    audio.playbackRate = rate;
  }
}

seekAudio(event: any): void {
  const audio = this.audioRef?.nativeElement;
  const value = parseFloat(event.target.value);
  if (audio) {
    audio.currentTime = value;
    this.currentTime = value;
  }
}

isVideoOnly(): boolean {
  return this.type === 'video' && !!this.selectedItem?.videos?.length;
}
}
