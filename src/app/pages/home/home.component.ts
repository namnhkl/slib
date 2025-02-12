import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '@/app/core/services/seo/seo.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, 
    // RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
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
