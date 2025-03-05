import { SharedModule } from '@/app/shared/shared.module';
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';

interface ISimpleItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-homecategories',
  templateUrl: './HomeCategories.component.html',
  styleUrls: ['./HomeCategories.component.scss'],
  imports: [CarouselModule, SharedModule],
})
export class HomeCategoriesComponent implements OnInit {
  constructor(private router: Router) {}

  customOptions: OwlOptions = {
    // autoWidth: true,
    loop: false,
    // items: '10',
    margin: 15,
    // slideBy: 'page',
    // merge: true,
    // autoplay: true,
    // autoplayTimeout: 5000,
    // autoplayHoverPause: true,
    // autoplaySpeed: 4000,
    dotsSpeed: 500,
    rewind: false,
    // dots: false,
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
        items: 6,
      },
    },
    // stagePadding: 40,
    nav: true,
  };
  simpleData: ISimpleItem[] = [
    {
      id: '1',
      title: 'Lớp 1',
      description: 'Lớp 1',
      image: './img/imageClass/lop1.svg',
    },
    {
      id: '2',
      title: 'Lớp 2',
      description: 'Lớp 2',
      image: './img/imageClass/lop2.svg',
    },
    {
      id: '3',
      title: 'Lớp 3',
      description: 'Lớp 3',
      image: './img/imageClass/lop3.svg',
    },
    {
      id: '4',
      title: 'Lớp 4',
      description: 'Lớp 4',
      image: './img/imageClass/lop4.svg',
    },
    {
      id: '5',
      title: 'Lớp 5',
      description: 'Lớp 5',
      image: './img/imageClass/lop5.svg',
    },
    {
      id: '6',
      title: 'Lớp 6',
      description: 'Lớp 6',
      image: './img/imageClass/lop6.svg',
    },
    {
      id: '7',
      title: 'Lớp 7',
      description: 'Lớp 7',
      image: './img/imageClass/lop7.svg',
    },
    {
      id: '8',
      title: 'Lớp 8',
      description: 'Lớp 8',
      image: './img/imageClass/lop8.svg',
    },
    {
      id: '9',
      title: 'Lớp 9',
      description: 'Lớp 9',
      image: './img/imageClass/lop9.svg',
    },
    {
      id: '10',
      title: 'Lớp 10',
      description: 'Lớp 10',
      image: './img/imageClass/lop10.svg',
    },
    {
      id: '11',
      title: 'Lớp 11',
      description: 'Lớp 11',
      image: './img/imageClass/lop11.svg',
    },
    {
      id: '12',
      title: 'Lớp 12',
      description: 'Lớp 12',
      image: './img/imageClass/lop12.svg',
    },
  ];

  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');

  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);

  ngOnInit() {
    console.log('HomeCategoriesComponent');
  }

  moveToSS() {
    this.router.navigate(['/' + this.currentUrl()], {
      fragment: 'second-section',
    });
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
