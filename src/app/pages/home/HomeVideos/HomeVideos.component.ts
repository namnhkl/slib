import { TintucService } from '@/app/shared/services/tintuc.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';
import { forkJoin } from 'rxjs';

interface ISimpleItem {
  id: string;
  video: SafeResourceUrl;
  title: string;
}

@Component({
  selector: 'app-homevideos',
  templateUrl: './HomeVideos.component.html',
  styleUrls: ['./HomeVideos.component.scss'],
  imports: [CarouselModule, TranslateModule],
})
export class HomeVideosComponent implements OnInit {
  constructor(private router: Router, public sanitizer: DomSanitizer) {}
  tinTucService = inject(TintucService);

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

    ngOnInit() {
  console.log('HomeCategoriesComponent');

  this.tinTucService.qtndTtTinTuc({
    qtndTtNhomTinTucId: '0414c195-1814-40bc-9e0f-8179f0a836e4',
    pageIndex: 0,
    pageSize: 10
  }).subscribe({
    next: (response) => {
      console.log('response qtndTtTinTuc', response);
      const items = response.data || [];

      if (!items.length) {
        this.simpleData = [];
        return;
      }

      // 👉 Lấy danh sách ID duy nhất
      const uniqueIds = [...new Set(items.map(item => item.id))];

      console.log('ID duy nhất:', uniqueIds);

      const chiTietRequests = uniqueIds.map(id => {
        console.log('Gọi chi tiết với ID:', id);
        return this.tinTucService.ChiTietTinTuc(id);
      });

      forkJoin(chiTietRequests).subscribe({
        next: (chiTietResponses) => {
          console.log('Kết quả chi tiết:', chiTietResponses);

          this.simpleData = chiTietResponses.map((res, index) => {
            const chiTiet = res.data?.[0]; // 👈 lấy phần tử đầu tiên trong mảng

            if (!chiTiet) return null;

            const rawUrl =
              chiTiet.tepTin01DuongDan?.trim() ||
              chiTiet.tepTin02DuongDan?.trim() ||
              chiTiet.tepTin03DuongDan?.trim() ||
              chiTiet.tepTin04DuongDan?.trim() ||
              chiTiet.tepTin05DuongDan?.trim() ||
              '';

            if (!rawUrl) return null;

           const fixedUrl = this.normalizeUrl(rawUrl);
            console.log('fixedUrl',fixedUrl);
            return {
              id: chiTiet.id,
              video: this.sanitizer.bypassSecurityTrustResourceUrl(fixedUrl),
              title: chiTiet.ten || `Video ${index + 1}`,
              ngayDangTin: chiTiet.ngayDangTin
            };
          }).filter(item => item !== null);
        },
        error: (err) => {
          console.error('Lỗi khi lấy chi tiết tin tức:', err);
          this.simpleData = [];
        }
      });
    },
    error: (err) => {
      console.error('Lỗi khi lấy danh sách tin tức:', err);
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
    console.log('HomeComponent');
    console.log(this.activeSlides());
  }

  getChangeData(data: any) {
    this.activeSlides.set(data);
    console.log('HomeComponent -> change');
    console.log(data);
  }

  getChangedData(data: any) {
    this.activeSlides.set(data);
    console.log('HomeComponent -> changed');
    console.log(data);
  }
}
