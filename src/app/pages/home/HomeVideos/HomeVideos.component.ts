import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  CarouselModule,
  OwlOptions,
  SlidesOutputData,
} from 'ngx-owl-carousel-o';

interface ISimpleItem {
  id: string;
  video: SafeResourceUrl;
  title: string;
}

@Component({
  selector: 'app-homevideos',
  templateUrl: './HomeVideos.component.html',
  styleUrls: ['./HomeVideos.component.scss'],
  imports: [CarouselModule],
})
export class HomeVideosComponent implements OnInit {
  constructor(private router: Router, public sanitizer: DomSanitizer) {}

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
        items: 1,
      },
      600: {
        items: 1,
      },
      900: {
        items: 4,
      },
    },
    // stagePadding: 40,
    nav: true,
  };
  simpleData: ISimpleItem[] = [];

  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');

  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);

  ngOnInit() {
    console.log('HomeCategoriesComponent');
    this.simpleData = Array.from({ length: 10 }).map((___, index) => {
      return {
        id: String(index),
        video: this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/tVZnBL1Gwzc?si=Z96UaU0d8LfHhf8K'),
        title: `${index + 1}. Video`,
      };
    })
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
