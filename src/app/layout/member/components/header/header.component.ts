import { CommonModule } from '@angular/common';
import {
  Component, EventEmitter, Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzPopoverModule,
    NzAvatarModule,
    NzIconModule,
    NzButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isCollapsed: boolean = false;

  @Output() dataEvent = new EventEmitter<boolean>();

  constructor(private router: Router) {

  }

  ShowHideSider(isCollap: boolean) {
    this.isCollapsed = !isCollap;
    this.dataEvent.emit(this.isCollapsed);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }
}
