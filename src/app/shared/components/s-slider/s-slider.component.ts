import {
  Component,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { IBoook } from '../../types/common';
import { URL_ROUTER } from '../../constants/path.constants';
@Component({
  selector: 'app-s-slider',
  templateUrl: './s-slider.component.html',
  styleUrls: ['./s-slider.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
  imports: [],
})
export class SSliderComponent implements OnInit {
  @Input() title = '';
  @Input() categoryId = 1;
  @Input() data: IBoook[] = [];
  constructor(private route: ActivatedRoute, private router: Router) {}
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

  currentUrl: WritableSignal<string> = signal('');
  fragment: WritableSignal<string | null> = signal('');
  activeSlides: WritableSignal<SlidesOutputData | null> = signal(null);

  ngOnInit() {
    console.log(this.route.pathFromRoot);
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

  buildLink(book: IBoook) {
    return `/${URL_ROUTER.documents}/${book.id}`;
  }
}
