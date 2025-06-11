import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-qtndtintuc-carousel',
  templateUrl: './qtndtintuc-carousel.component.html',
  styleUrls: ['./qtndtintuc-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class QtndTinTucCarouselComponent implements OnInit {
  slides: any[] = [];
  currentIndex: number = 0;
  slideCount: number = 3;

  constructor(private cdr: ChangeDetectorRef) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.updateSlideCount();
  }

  updateSlideCount(): void {
    const width = window.innerWidth;
    if (width < 640) {
      this.slideCount = 1;
    } else if (width < 1024) {
      this.slideCount = 2;
    } else {
      this.slideCount = 3;
    }
    console.log(`Screen width: ${width}, slideCount: ${this.slideCount}`); // Debug log
    // Delay to ensure DOM updates
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);

  //   setInterval(() => {
  //   this.autoNextSlide();
  // }, 4000);
  }

  ngOnInit(): void {
    this.slides = [
      {
        image: 'https://storage.googleapis.com/a1aa/image/d001b338-7ee8-4447-f39d-da2f5341da4b.jpg',
        category: 'Tập huấn',
        date: '17.05.2025',
        title: 'Ứng dụng các tiến bộ AI hỗ trợ học tập và nghiên cứu',
        description: 'Trang bị kiến thức nền tảng và kỹ năng ứng dụng AI vào học tập và nghiên cứu.'
      },
      {
        image: 'https://storage.googleapis.com/a1aa/image/0360b131-0fce-4da2-028e-6ca80abe139d.jpg',
        category: 'Triển lãm',
        date: '24.04.2025',
        title: 'Đọc sách thời đại số: Đọc thông minh - bảo vệ bản quyền',
        description: 'Thúc đẩy công nghệ đọc hiện đại, nâng cao nhận thức bản quyền số.'
      },
      {
        image: 'https://storage.googleapis.com/a1aa/image/3cf144c1-8148-42b9-f7fc-2ec3dbbdc768.jpg',
        category: 'Hội sách',
        date: '23.04.2025',
        title: 'Hội sách Sinh viên TDTU 2025',
        description: 'Cơ hội tiếp cận hàng ngàn đầu sách và lan tỏa văn hóa đọc.'
      },
      {
        image: 'https://placehold.co/360x200?text=Slide+4',
        category: 'Sự kiện',
        date: '01.05.2025',
        title: 'Sự kiện đọc sách ngoài trời',
        description: 'Thư giãn và đọc sách giữa không gian xanh mát.'
      }
    ];
    this.updateSlideCount();
  }

  nextSlide(): void {
    if (this.currentIndex < this.slides.length - this.slideCount) {
      this.currentIndex += 1;
    } else {
      this.currentIndex = 0;
    }
    this.cdr.detectChanges();
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    } else {
      this.currentIndex = this.slides.length - this.slideCount;
    }
    this.cdr.detectChanges();
  }

  autoNextSlide(): void {
    this.nextSlide();
  }
}