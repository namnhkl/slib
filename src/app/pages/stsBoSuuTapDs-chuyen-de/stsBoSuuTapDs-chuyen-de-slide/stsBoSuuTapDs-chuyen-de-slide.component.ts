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
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '@/app/shared/services/auth.service';
import { TaiLieuService } from '../../tai-lieu/tai-lieu.service';
import { SharedService } from '@/app/shared/services/shared.service';
import { IResponse } from '@/app/shared/types/common';
import { IDocument } from '../../tai-lieu/tai-lieu';
import { IChuyenDe } from '../stsBoSuuTapDs-chuyen-de.type';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { register } from 'swiper/element/bundle';
import { stsBoSuuTapDsChuyenDeService } from '../stsBoSuuTapDs-chuyen-de.service';
register();
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
  imports: [CarouselModule, SharedModule,AsyncPipe, JsonPipe, RouterLink, TranslateModule, NgIf, NzSpinModule],
})
export class ChuyenDeSlideComponent implements OnInit {
  @ViewChild('owlCar', { static: false }) owlCar!: CarouselComponent;
  sharedService = inject(SharedService);
  chuyendeService = inject(stsBoSuuTapDsChuyenDeService);
  isLoading = true;
  goToNext() {
    this.owlCar.next();
  }

  goToPrev() {
    this.owlCar.prev();
  }
  $chuyende: Observable<any> | null;

constructor(private router: Router, private documentSer: TaiLieuService) {
  this.isLoading = true;

  this.$chuyende = this.documentSer.getChuyenDes(this.sharedService.thuVienId).pipe(
    map((res: IResponse<IChuyenDe[]>) => (res?.data || []).filter(item => item.stsBoSuuTapId === '0')),
    switchMap((chuyendes: IChuyenDe[]) => {
      if (chuyendes.length === 0) return of([]);

      // Gọi API tài liệu cho từng chuyên đề
      const requests = chuyendes.map(chuyende =>
        this.chuyendeService
          .getChuyenDeItem({pageIndex:0, pageSize:5, stsBoSuuTapId: chuyende.id, bsThuvienId: this.sharedService.thuVienId})
          .pipe(
            map((res: IResponse<any[]>) => ({
              ...chuyende,
              taiLieus: res?.data || [],
            })),
            catchError(err => {
              console.error('Lỗi khi lấy tài liệu cho chuyên đề:', chuyende.id, err);
              return of({
                ...chuyende,
                taiLieus: [],
              });
            })
          )
      );
      return forkJoin(requests);
    }),
    tap(() => (this.isLoading = false)),
    catchError(err => {
      console.error('Lỗi khi load chuyên đề:', err);
      this.isLoading = false;
      return of([]);
    })
  );
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
        items: 4,
      },
      1200: {
        items: 4,
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
