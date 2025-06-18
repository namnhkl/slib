/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef, inject, Input, SimpleChanges } from '@angular/core';
import { QtndTinTucService } from '../QtndTinTuc.service';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedService } from '@/app/shared/services/shared.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
register(); // Gọi 1 lần duy nhất

@Component({
  selector: 'app-qtndtintuc-carousel',
  templateUrl: './qtndtintuc-carousel.component.html',
  styleUrls: ['./qtndtintuc-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule,TranslateModule,RouterModule,NzDividerModule,NzIconModule],
  providers:[QtndTinTucService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
     
      nz-divider {
        font-size:30px !important;
          font-weight: bold;
      }
    `
  ]
})
export class QtndTinTucCarouselComponent implements OnInit {
  slides: any[] = [];
  currentIndex: number = 0;
  slidesPerView: number = 4; // Giá trị mặc định cho desktop

  @Input() qtndTtNhomTinTucId: string = '';
  @Input() text1: string = '';
  @Input() text2: string = '';
  @Input() text3: string = '';
   @Input() removeid: string = '';

  constructor(private cdr: ChangeDetectorRef, private newService: QtndTinTucService, private sharedService: SharedService ) {}

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.getTopNewsData();
    window.addEventListener('resize', this.updateSlidesPerView.bind(this));
  }

   ngOnChanges(changes: SimpleChanges): void {
  
    if (changes['qtndTtNhomTinTucId'] && !changes['qtndTtNhomTinTucId'].firstChange) {
      this.getTopNewsData();
    }


    if (changes['text1'] && !changes['text1'].firstChange) {
      // console.log('text1 changed:', this.text1);
    }

    if (changes['text2'] && !changes['text2'].firstChange) {
      // console.log('text2 changed:', this.text2);
    }

    if (changes['text3'] && !changes['text3'].firstChange) {
      // console.log('text3 changed:', this.text3);
    }
  }

  
updateSlidesPerView() {
  const width = window.innerWidth;
  if (width < 640) this.slidesPerView = 1;
  else if (width < 1024) this.slidesPerView = 3;
  else this.slidesPerView = 4;
}

  getTopNewsData() {
  this.newService.getNews(0, 9999, {
    qtndTtNhomTinTucId: this.qtndTtNhomTinTucId,
    bsThuvienId: this.sharedService.thuVienId
  }).pipe(
    tap(res => {
      if (res.messageCode === 1) {
        // Lọc ra những item không trùng với this.removeid
        const filtered = Array.isArray(res.data)
          ? res.data.filter(item => item.id !== this.removeid)
          : [];

        this.slides = filtered.slice(0, 6);
        console.log('slides', this.slides);
        this.updateSlidesPerView();
      } else {
        this.slides = [];
      }
      this.cdr.detectChanges();
    })
  ).subscribe();
}

  
}