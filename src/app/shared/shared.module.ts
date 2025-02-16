import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SSliderComponent } from './components/s-slider/s-slider.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule
    //import components and modules here
  ],
  declarations: [
    SSliderComponent,
  ],
  exports: [
    //export components and modules here
    SSliderComponent
  ],
})
export class SharedModule {}
