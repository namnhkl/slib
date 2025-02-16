import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRoutingModule } from './news-routing.module';
import { DetailsComponent } from './details/details.component';

@NgModule({
  imports: [CommonModule, NewRoutingModule],
  declarations: [DetailsComponent],
})
export class NewModule {}
