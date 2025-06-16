import { NhacViecService } from '@/app/shared/services/nhacviec.service';
import { SharedService } from '@/app/shared/services/shared.service';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';
import { tap } from 'rxjs';

interface CarouselData {
  id: string;
  text: string;
  dataMerge?: number;
  width: number;
  dotContent?: string;
  src?: string;
  dataHash?: string;
}

@Component({
  selector: 'app-home-sliders',
  templateUrl: './HomeSliders.component.html',
  styleUrls: ['./HomeSliders.component.scss'],
  imports: [CarouselModule],
})
export class HomeSlidersComponent implements OnInit {




  carouselData: WritableSignal<CarouselData[]> = signal([
   
  ]);

  customOptions: OwlOptions = {
    loop: true,
    rewind: false,
    dots: true,
    smartSpeed: 400,
    dragEndSpeed: 350,
    slideBy: 'page',
    items: 1,
    nav: true,
    autoplay: true,
    autoplayTimeout: 3000,
  };

  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');
  sharedService= inject(SharedService);
  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);

  constructor(private route: ActivatedRoute, private router: Router, private nhacviecService: NhacViecService,) {}

  ngOnInit() {
    this.nhacviecService.qtndQlQuangCao(this.sharedService.thuVienId).subscribe((res: any) => {
  if (res?.data && Array.isArray(res.data)) {
    const transformed: CarouselData[] = res.data.map((item: { ten: string; tepTinDuLieu: string; sapXep: number }, index: number) => ({
      id: `slide-${index + 1}`,
      text: item.ten,
      width: 500,
      dotContent: `text${index + 1}`,
      src: item.tepTinDuLieu || '',
    }));

    this.carouselData.set(transformed);

    console.log('carouselData',this.carouselData);
  }
});


    this.route.fragment
      .pipe(
        tap((fragment) => this.fragment.set(fragment))
      )
      .subscribe((res) => {
        // console.log('fragment', res);
      });

    this.route.url
      .pipe(
        tap((url) => {
          if (url && url.length > 0) {
            this.currentUrl.set(url[0].path);
          }
        })
      )
      .subscribe((res) => {
        // console.log('url', res);
      });
  }

  moveToSS() {
    // this.router.navigate(['/' + this.currentUrl()], {
    //   fragment: 'second-section',
    // });
  }

  getPassedData(data: any) {
    this.activeSlides.set(data);
  }

  getChangeData(data: any) {
    this.activeSlides.set(data);
  }

  getChangedData(data: any) {
    this.activeSlides.set(data);
  }
}