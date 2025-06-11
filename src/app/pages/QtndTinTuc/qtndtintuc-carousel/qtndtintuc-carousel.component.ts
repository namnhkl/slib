/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { QtndTinTucService } from '../QtndTinTuc.service';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import {  CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
register(); // Gọi 1 lần duy nhất

@Component({
  selector: 'app-qtndtintuc-carousel',
  templateUrl: './qtndtintuc-carousel.component.html',
  styleUrls: ['./qtndtintuc-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule,TranslateModule,RouterModule],
  providers:[QtndTinTucService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QtndTinTucCarouselComponent implements OnInit {
  slides: any[] = [];
  currentIndex: number = 0;
  slidesPerView: number = 4; // Giá trị mặc định cho desktop


  constructor(private cdr: ChangeDetectorRef, private newService: QtndTinTucService ) {}

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.getTopNewsData();
    window.addEventListener('resize', this.updateSlidesPerView.bind(this));
  }

  
updateSlidesPerView() {
  const width = window.innerWidth;
  if (width < 640) this.slidesPerView = 1;
  else if (width < 1024) this.slidesPerView = 3;
  else this.slidesPerView = 4;
}

  getTopNewsData() {
    this.newService.getNews(0, 9999).pipe(
      tap(res => {
        if (res.messageCode === 1) {
          this.slides = Array.isArray(res.data) ? res.data.slice(0, 6) : [];
          this.updateSlidesPerView();
        } else {
          this.slides = [];
        }
        this.cdr.detectChanges();
      })
    ).subscribe();
  }

  
}