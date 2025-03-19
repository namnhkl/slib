import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileService } from './profile.service';

@NgModule({
  imports: [CommonModule, ProfileRoutingModule],
  providers: [ProfileService],
})
export class ProfileModule {}
