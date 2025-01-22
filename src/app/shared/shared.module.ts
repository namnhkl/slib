import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SSlidersComponent } from './components/s-sliders/s-sliders.component';
import { BannerSlidersComponent } from './components/banner-sliders/banner-sliders.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
    SSlidersComponent,
    BannerSlidersComponent,
    HeaderComponent,
    FooterComponent
  ],
  exports: [
    CommonModule,
    SSlidersComponent,
    BannerSlidersComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class SharedModule {}