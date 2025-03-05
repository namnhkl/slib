import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    NzPopoverModule,
    NzAvatarModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private router: Router) {

  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }
}
