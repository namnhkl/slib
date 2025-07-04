import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  signal,
  TemplateRef,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { IBoook } from '../../types/common';
import { URL_ROUTER } from '../../constants/path.constants';
@Component({
  selector: 'app-s-slider',
  templateUrl: './s-slider.component.html',
  styleUrls: ['./s-slider.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class SSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('titleElement') titleElement: ElementRef | undefined;
  @Input() children: TemplateRef<unknown> | null = null;

  @Input() title: TemplateRef<unknown> | string = '';
  @Input() bmDmDangTaiLieuId: TemplateRef<unknown> | string = '';
  @Input() categoryId = 1;
  @Input() data: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2
  ) {}

  @Input() customOptions: OwlOptions = {
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

  ngAfterViewInit() {
    this.checkTitleHeight();
  }

  ngOnInit() {
    // console.log(this.route.pathFromRoot);
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

  buildLink(book: IBoook) {
    return `/${URL_ROUTER.documents}/${book.id}`;
  }

  checkTitleHeight() {
    if (this.titleElement) {
      const element = this.titleElement.nativeElement;
      const lineHeight = parseInt('20', 10);
      const height = element.offsetHeight;
      // console.log(
      //   '🚀 ~ SSliderComponent ~ checkTitleHeight ~ height:',
      //   element.innerText
      // );
      const lines = height / lineHeight;

      if (lines > 1) {
        this.renderer.addClass(element, 'title--multiline');
      }
    }
  }
}
