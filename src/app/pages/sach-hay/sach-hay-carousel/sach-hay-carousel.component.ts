/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef, inject, Input, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedService } from '@/app/shared/services/shared.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SachHayService } from '../sach-hay.service';
register(); // Gọi 1 lần duy nhất

@Component({
  selector: 'app-sach-hay-carousel',
  templateUrl: './sach-hay-carousel.component.html',
  styleUrls: ['./sach-hay-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule,TranslateModule,RouterModule,NzDividerModule,NzIconModule],
  providers:[SachHayService],
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
export class SachHayCarouselComponent implements OnInit {
  @ViewChild('swiperEl', { static: false }) swiperEl?: ElementRef;
  slides: any[] = [];
  currentIndex: number = 0;
  slidesPerView: number = 4; // Giá trị mặc định cho desktop

  @Input() qtndDmLoaiThuMucId: string = '';
  @Input() text1: string = '';
  @Input() text2: string = '';
  @Input() text3: string = '';
   @Input() removeid: string = '';

  constructor(private cdr: ChangeDetectorRef, private sachHayService: SachHayService, private sharedService: SharedService ) {}

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.getTopSachHayData();
    window.addEventListener('resize', this.updateSlidesPerView.bind(this));
  }

   ngOnChanges(changes: SimpleChanges): void {
  
    if (changes['qtndDmLoaiThuMucId'] && !changes['qtndDmLoaiThuMucId'].firstChange) {
      this.getTopSachHayData();
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

getTopSachHayData() {
  this.sachHayService.getDanhMucSachHay({
    qtndDmLoaiThuMucId: this.qtndDmLoaiThuMucId,
    bsThuVienId: this.sharedService.thuVienId,
    pageIndex: 0,
    pageSize: 999
  }).pipe(
    tap(res => {
      if (res.messageCode === 1) {
        const filtered = Array.isArray(res.data)
          ? res.data.filter(item => item.id !== this.removeid)
          : [];

        this.slides = filtered.slice(0, 6);
        this.cdr.detectChanges();

        // ✅ Delay gọi updateSwiper để DOM render xong
        setTimeout(() => {
  if (this.swiperEl?.nativeElement) {
    this.slides = filtered.slice(0, 6);
    this.cdr.detectChanges();
  } else {
    console.warn('Swiper DOM chưa sẵn sàng. Delay thêm.');
    setTimeout(() => {
      this.slides = filtered.slice(0, 6);
      this.cdr.detectChanges();
    }, 100); // Thử lại sau 100ms
  }
}, 0);
      } else {
        this.slides = [];
        this.cdr.detectChanges();
      }
    })
  ).subscribe();
}


  
}