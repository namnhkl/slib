import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef, inject } from '@angular/core';
import { QtndTinTucService } from '../QtndTinTuc.service';
import { tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-qtndtintuc-carousel',
  templateUrl: './qtndtintuc-carousel.component.html',
  styleUrls: ['./qtndtintuc-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule,TranslateModule],
  providers:[QtndTinTucService]
})
export class QtndTinTucCarouselComponent implements OnInit {
  slides: any[] = [];
  currentIndex: number = 0;
  slidesPerView: number = 3; // Giá trị mặc định cho desktop

  constructor(private cdr: ChangeDetectorRef, private newService: QtndTinTucService ) {}

  ngOnInit(): void {
    this.updateSlidesPerView();
    this.getTopNewsData();
  }

  @HostListener('window:resize')
  updateSlidesPerView(): void {
    const width = window.innerWidth;
    
    if (width < 640) {
      this.slidesPerView = 1;
    } else if (width < 1024) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 3;
    }

    // Reset currentIndex nếu cần
    this.currentIndex = Math.min(this.currentIndex, this.slides.length - this.slidesPerView);
    this.cdr.detectChanges();
  }

  nextSlide(): void {
    if (this.currentIndex < this.slides.length - this.slidesPerView) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = Math.max(0, this.slides.length - this.slidesPerView);
    }
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