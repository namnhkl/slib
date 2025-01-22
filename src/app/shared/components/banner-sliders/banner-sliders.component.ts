import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

import { Component } from '@angular/core';

@Component({
	selector: 'banner-sliders',
	templateUrl: './banner-sliders.component.html',
	styleUrl: './banner-sliders.component.scss',
	standalone: true,
	imports: [CarouselModule],
})
export class BannerSlidersComponent {
	customOptions: OwlOptions = {
		loop: true,
		mouseDrag: true,
		touchDrag: true,
		pullDrag: true,
		dots: false,
		navSpeed: 700,
    items: 1,
		nav: false,
	};
}
