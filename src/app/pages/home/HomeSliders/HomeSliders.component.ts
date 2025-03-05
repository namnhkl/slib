import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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
    {
      id: 'slide-1',
      text: 'Slide 1 HM',
      dataMerge: 2,
      width: 300,
      dotContent: 'text1',
    },
    {
      id: 'slide-2',
      text: 'Slide 2 HM',
      dataMerge: 1,
      width: 500,
      dotContent: 'text2',
    },
    {
      id: 'slide-3',
      text: 'Slide 3 HM',
      dataMerge: 3,
      width: 500,
      dotContent: 'text3',
    },
    { id: 'slide-4', text: 'Slide 4 HM', width: 450, dotContent: 'text4' },
    {
      id: 'slide-5',
      text: 'Slide 5 HM',
      dataMerge: 2,
      width: 500,
      dotContent: 'text5',
    },
    { id: 'slide-6', text: 'Slide 6', width: 500, dotContent: 'text5' },
    { id: 'slide-7', text: 'Slide 7', width: 500, dotContent: 'text6' },
    { id: 'slide-8', text: 'Slide 8', width: 500, dotContent: 'text8' },
    // { id: 'slide-7', text: 'Slide 7', dotContent: 'text5'},
    // { id: 'slide-8', text: 'Slide 8', dotContent: 'text5'},
    // { id: 'slide-9', text: 'Slide 9', dotContent: 'text5'},
    // { id: 'slide-10', text: 'Slide 10', dotContent: 'text5'},
  ]);

  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: true,
    // items: '10',
    // margin: 10,
    // slideBy: 'page',
    // merge: true,
    // autoplay: true,
    // autoplayTimeout: 5000,
    // autoplayHoverPause: true,
    // autoplaySpeed: 4000,
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
    items: 1,
    // stagePadding: 40,
    nav: false,
  };

  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');

  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // console.log(this.route.pathFromRoot);
    this.route.fragment
      .pipe(
        tap((fragment) => this.fragment.set(fragment))
        // tap(() => console.log('this.fragment', this.fragment()))
      )
      .subscribe((res) => {
        console.log('fragment', res);
      });

    this.route.url
      .pipe(
        tap((url) => this.currentUrl.set(url[0].path))
        // tap(() => console.log('this.currentUrl', this.currentUrl()))
      )
      .subscribe((res) => {
        console.log('fragment', res);
      });
  }

  moveToSS() {
    // this.router.navigate(['/' + this.currentUrl()], {
    //   fragment: 'second-section',
    // });
  }

  getPassedData(data: any) {
    this.activeSlides.set(data);
    console.log('HomeComponent');
    console.log(this.activeSlides());
  }

  getChangeData(data: any) {
    this.activeSlides.set(data);
    console.log('HomeComponent -> change');
    console.log(data);
  }

  getChangedData(data: any) {
    this.activeSlides.set(data);
    console.log('HomeComponent -> changed');
    console.log(data);
  }
}
