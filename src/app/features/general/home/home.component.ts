import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo/seo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, 
    // RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private seoService: SeoService) {
    const content =
      'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    const title = 'Home Page';

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);
  }
}
