import { AuthService } from '@/app/shared/services/auth.service';
import { SharedModule } from '@/app/shared/shared.module';
import { storage } from '@/app/utils';
import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { BookBorrowedComponent } from "../../shared/components/book-borrowed/book-borrowed.component";
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ProfileDocumentListComponent } from './profile-document-list/profile-document-list.component';
import { ProfileService } from './profile.service';
import { BdBanDocProfile } from '@/app/interfaces/bdbandocprofile.interface copy';
import { IResponse } from '@/app/shared/types/common';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, JsonPipe, RouterLink, SharedModule, TranslateModule, BookBorrowedComponent, ProfileDocumentListComponent,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: any;
  bdBanDocChiTiet: any;
  bdBanDocChiTietSubscription: Subscription | undefined;

  $readBooks: Observable<any> | null;
  $favoriteDocuments: Observable<any> | null;
  $borrowedDocuments: Observable<any> | null;
  $borrowedBooks: Observable<any> | null;

  customOptions: OwlOptions = {};

  constructor(private authService: AuthService, private router: Router, private profileService: ProfileService) {
    this.$readBooks = this.authService.countReadBooks();
    this.$favoriteDocuments = this.authService.getFavoriteDocuments();
    this.$borrowedDocuments = this.authService.getBorrowedDocuments();
    this.$borrowedBooks = this.authService.getCirHistoryItem();
  }

  ngOnInit() {
    // const raw = storage.getItem('appSession') || sessionStorage.getItem('appSession');
    // this.profile = typeof raw === 'string' ? JSON.parse(raw) : raw;
    // this.customOptions = {
    //   // autoWidth: true,
    //   loop: true,
    //   margin: 30,
    //   // slideBy: 'page',
    //   // merge: true,
    //   // autoplay: true,
    //   // autoplayTimeout: 5000,
    //   // autoplayHoverPause: true,
    //   // autoplaySpeed: 4000,
    //   dotsSpeed: 500,
    //   rewind: false,
    //   dots: false,
    //   // dotsData: true,
    //   // mouseDrag: false,
    //   // touchDrag: false,
    //   // pullDrag: false,
    //   smartSpeed: 400,
    //   // fluidSpeed: 499,
    //   dragEndSpeed: 350,
    //   // dotsEach: 4,
    //   // center: true,
    //   // rewind: true,
    //   // rtl: true,
    //   // startPosition: 1,
    //   // navText: [ '<i class=fa-chevron-left>left</i>', '<i class=fa-chevron-right>right</i>' ],
    //   slideBy: 'page',
    //   responsive: {
    //     0: {
    //       items: 2,
    //     },
    //     600: {
    //       items: 6,
    //     },
    //   },
    //   // stagePadding: 40,
    //   nav: true,

    // }

    this.bdBanDocChiTietSubscription = this.profileService.bdBanDocChiTiet().subscribe({
  next: (response) => {
    if (response.messageCode === 1 && response.data.length > 0) {
      this.bdBanDocChiTiet = response.data[0];
      console.log('Dữ liệu bạn đọc chi tiết:', this.bdBanDocChiTiet);
    } else {
      console.warn('Không có dữ liệu hoặc gọi API không thành công');
    }
  },
  error: (error) => {
    console.error('Lỗi khi gọi API bdBanDocChiTiet:', error);
  }
});



  }

  ngAfterViewInit(): void {
  window.dispatchEvent(new Event('resize'));
}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

getNam(dateStr?: string): string {
  if (!dateStr) return '';
  
  // Split the date string in dd/mm/yyyy format
  const parts = dateStr.split('/');
  if (parts.length !== 3) return ''; // Ensure the format is valid
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Month is 0-based in JavaScript
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  return isNaN(date.getTime()) ? '' : date.getFullYear().toString();
}

  ngOnDestroy(): void {
  if (this.bdBanDocChiTietSubscription) {
    this.bdBanDocChiTietSubscription.unsubscribe();
  }
}
}
