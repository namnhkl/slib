import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Component, Input } from '@angular/core';
@Component({
  selector: 's-sliders',
  templateUrl: './s-sliders.component.html',
  styleUrl: './s-sliders.component.scss',
  imports: [CarouselModule],
  standalone: true,
})
export class SSlidersComponent {
	// @Input() slidesStore: any[] = [];
	@Input() title: string = '';
  items = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    items: 6,
    nav: false,
  };
}
