import { QtndTinTucService } from '@/app/shared/services/QtndTinTuc.service';
import { SharedService } from '@/app/shared/services/shared.service';
import { IChiTietTinTuc } from '@/app/shared/types/tintuc';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'environments/environment';
import {
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';
import { forkJoin } from 'rxjs';

interface ISimpleItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-qtndtintuc-video-slide',
  templateUrl: './qtndtintuc-video-slide.component.html',
  styleUrls: ['./qtndtintuc-video-slide.component.scss'],
  imports: [CarouselModule, TranslateModule,RouterLink],
})
export class TinTucVideoSlideComponent implements OnInit {
  constructor(private router: Router, public sanitizer: DomSanitizer) {}
  tinTucService = inject(QtndTinTucService);
  tinVideoDefault = environment.ID_TIN_VIDEO_DEFAULT;
  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: false,
    // items: '10',
    margin: 15,
    // slideBy: 'page',
    // merge: true,
    // autoplay: true,
    // autoplayTimeout: 5000,
    // autoplayHoverPause: true,
    // autoplaySpeed: 4000,
    dotsSpeed: 500,
    rewind: false,
    dots: false,
    // dotsData: true,
    // mouseDrag: false,
    // touchDrag: false,
    // pullDrag: false,
    smartSpeed: 400,
    // fluidSpeed: 499,
    dragEndSpeed: 350,
    // dotsEach: 4,
    // center: true,
    // rewind: true,
    // rtl: true,
    // startPosition: 1,
    // navText: [ '<i class=fa-chevron-left>left</i>', '<i class=fa-chevron-right>right</i>' ],
    slideBy: 'page',
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      900: {
        items: 4,
      },
    },
    // stagePadding: 40,
    nav: true,
  };
  simpleData: ISimpleItem[] = [];

  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');

  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);
  sharedService = inject(SharedService);

   ngOnInit() {
  // console.log('HomeCategoriesComponent - ngOnInit');

  this.tinTucService.qtndTtTinTucVideo({
    pageIndex: 0,
    pageSize: environment.PAGE_SIZE,
    bsThuvienId: this.sharedService.thuVienId
  }).subscribe({
    next: (response) => {
      // console.log('===> Audio API Response:', response);

      const items: IChiTietTinTuc[] = response?.data ?? [];

      if (!Array.isArray(items) || items.length === 0) {
        this.simpleData = [];
        return;
      }

      // Map trực tiếp từ items mà không cần gọi thêm API
      const allVideoItems: ISimpleItem[] = items.map((chiTiet, index) => {

        return {
          id: chiTiet.id,
          title: chiTiet.ten || `Video ${index + 1}`,
          ngayDangTin: chiTiet.ngayDangTin,
          moTa: chiTiet.moTa || '',
          anhDaiDien: chiTiet.anhDaiDien?.trim() || '/img/default-video.png'
        };
      }).filter(item => item !== null) as ISimpleItem[];

      this.simpleData = allVideoItems;
      // console.log('🎯 Tổng simpleData:', this.simpleData);
    },
    error: (err) => {
      console.error('🔥 Lỗi khi lấy danh sách tin tức video:', err);
      this.simpleData = [];
    }
  });
}


 normalizeUrl(url: string): string {
  return url
    .replace(/\\\\/g, '/')        // \\ => /
    .replace(/\\/g, '/')          // \ => /
    .replace(/^https?:\/(?!\/)/, match => match + '/'); // https:/abc -> https://abc
}

  moveToSS() {
    this.router.navigate(['/' + this.currentUrl()], {
      fragment: 'second-section',
    });
  }

  getPassedData(data: any) {
    this.activeSlides.set(data);
    // console.log('HomeComponent');
    // console.log(this.activeSlides());
  }

  getChangeData(data: any) {
    this.activeSlides.set(data);
    // console.log('HomeComponent -> change');
    // console.log(data);
  }

  getChangedData(data: any) {
    this.activeSlides.set(data);
    // console.log('HomeComponent -> changed');
    // console.log(data);
  }
}
