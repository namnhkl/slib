import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SSliderComponent } from './components/s-slider/s-slider.component';
import { BookItemComponent } from './components/book-item/book-item.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SpinnerService } from './services/spinner.service';
import { LoaderService } from './services/loader.service';
import { AuthService } from './services/auth.service';
import { BookItemSliderComponent } from './components/book-item-slider/book-item-slider.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    //import components and modules here
  ],
  declarations: [BookItemComponent,BookItemSliderComponent, SSliderComponent],
  exports: [
    //export components and modules here
    SSliderComponent,
    BookItemSliderComponent,
    BookItemComponent,
  ],
  providers: [
    //provide services here
    SpinnerService,
    LoaderService,
  ],
})
export class SharedModule {}
