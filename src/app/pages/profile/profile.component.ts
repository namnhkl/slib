import { AuthService } from '@/app/shared/services/auth.service';
import { SharedModule } from '@/app/shared/shared.module';
import { storage } from '@/app/utils';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BookBorrowedComponent } from "../../shared/components/book-borrowed/book-borrowed.component";
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-profile',
  imports: [AsyncPipe, JsonPipe, RouterLink, SharedModule, TranslateModule, BookBorrowedComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profile: any;

  $readBooks: Observable<any> | null;
  $favoriteDocuments: Observable<any> | null;
  $borrowedDocuments: Observable<any> | null;
  $borrowedBooks: Observable<any> | null;

  customOptions: OwlOptions = {};

  constructor(private authService: AuthService, private router: Router) {
    this.$readBooks = this.authService.countReadBooks();
    this.$favoriteDocuments = this.authService.getFavoriteDocuments();
    this.$borrowedDocuments = this.authService.getBorrowedDocuments();
    this.$borrowedBooks = this.authService.countBorrowedBooks();
  }

  ngOnInit() {
    const raw = storage.getItem('appSession') || sessionStorage.getItem('appSession');
this.profile = typeof raw === 'string' ? JSON.parse(raw) : raw;
    this.customOptions = {
      // autoWidth: true,
      loop: true,
      margin: 30,
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
          items: 2,
        },
        600: {
          items: 6,
        },
      },
      // stagePadding: 40,
      nav: true,

    }
  }

  ngAfterViewInit(): void {
  window.dispatchEvent(new Event('resize'));
}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
