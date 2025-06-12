import { SharedModule } from '@/app/shared/shared.module';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ViewChild } from '@angular/core';
import {
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
  CarouselComponent 
} from 'ngx-owl-carousel-o';
import { map, Observable } from 'rxjs';
import { AuthService } from '@/app/shared/services/auth.service';
import { TaiLieuService } from '../../tai-lieu/tai-lieu.service';
import { SharedService } from '@/app/shared/services/shared.service';
import { IResponse } from '@/app/shared/types/common';
import { IDocument } from '../../tai-lieu/tai-lieu';
import { IChuyenDe } from '../stsBoSuuTapDs-chuyen-de.type';

interface ISimpleItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-chuyen-de-slide',
  templateUrl: './stsBoSuuTapDs-chuyen-de-slide.component.html',
  styleUrls: ['./stsBoSuuTapDs-chuyen-de-slide.component.scss'],
  imports: [CarouselModule, SharedModule,AsyncPipe, JsonPipe, RouterLink, TranslateModule, NgIf],
})
export class ChuyenDeSlideComponent implements OnInit {
  @ViewChild('owlCar', { static: false }) owlCar!: CarouselComponent;
  sharedService = inject(SharedService);
  goToNext() {
    this.owlCar.next();
  }

  goToPrev() {
    this.owlCar.prev();
  }
  $chuyende: Observable<any> | null;
  constructor( private router: Router, private documentSer : TaiLieuService) {
     this.$chuyende = this.documentSer.getChuyenDes(this.sharedService.thuVienId).pipe(
      map((res: IResponse<IChuyenDe[]>) => (res?.data || []).filter(item => item.stsBoSuuTapId === "0"))    
);


     // Debug dữ liệu từ Observable

    this.$chuyende.subscribe({
      next: (data) => console.log('Dữ liệu từ $chuyende:', data),
      error: (err) => console.error('Lỗi từ $chuyende:', err),
      complete: () => console.log('Hoàn tất $chuyende')
    });

    
}

  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: true,
    // items: '10',
    margin: 30,
    // slideBy: 'page',
    // merge: true,
    // autoplay: true,
    // autoplayTimeout: 5000,
    // autoplayHoverPause: true,
    // autoplaySpeed: 4000,
    dotsSpeed: 500,
    rewind: false,
    dots: true,
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
        items: 3,
      },
      900: {
        items: 5,
      },
      1200: {
        items: 6,
      },
    },
    // stagePadding: 40,
    nav: true,
  };


  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');

  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);

  ngOnInit() {
    // console.log('HomeCategoriesComponent');
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
