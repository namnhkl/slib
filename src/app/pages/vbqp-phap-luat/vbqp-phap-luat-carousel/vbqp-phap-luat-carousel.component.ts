/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef, inject, Input, SimpleChanges } from '@angular/core';
import { VbqpPhapLuatService } from '../vbqp-phap-luat.service';
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
  selector: 'app-vbqp-phap-luat-carousel',
  templateUrl: './vbqp-phap-luat-carousel.component.html',
  styleUrls: ['./vbqp-phap-luat-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule,TranslateModule,RouterModule,NzDividerModule,NzIconModule],
  providers:[VbqpPhapLuatService],
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
export class VbqpPhapLuatCarouselComponent implements OnInit {
  slides: any[] = [];
  currentIndex: number = 0;
  slidesPerView: number = 4; // Giá trị mặc định cho desktop

  @Input() loaiVanBanId: string = '';
  @Input() text1: string = '';
  @Input() text2: string = '';
  @Input() text3: string = '';
   @Input() removeid: string = '';

  constructor(private cdr: ChangeDetectorRef, private newService: VbqpPhapLuatService, private sharedService: SharedService ) {}

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.getTopvbqpphapluatData();
    window.addEventListener('resize', this.updateSlidesPerView.bind(this));
  }

   ngOnChanges(changes: SimpleChanges): void {
  
    if (changes['loaiVanBanId'] && !changes['loaiVanBanId'].firstChange) {
      this.getTopvbqpphapluatData();
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

  getTopvbqpphapluatData() {
  this.newService.qtndNvVanBan( {
    qtndDmLoaiVanBanId: this.loaiVanBanId,
    bsThuVienId: this.sharedService.thuVienId,
    pageIndex:0,
    pageSize:999
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