import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { LoginButtonComponent } from './login-button/login-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    LoginButtonComponent,
    RouterLink,
    RouterModule,
    NzPopoverModule,
    NzButtonModule,
    FormsModule,
    NzSelectModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected links = [
    {
      title: 'Trang chủ',
      url: URL_ROUTER.home,
    },
    {
      title: 'Giới thiệu',
      url: URL_ROUTER.about,
    },
    {
      title: 'Tin tức',
      url: URL_ROUTER.news,
    },
    {
      title: 'Sách hay',
      url: URL_ROUTER.documents,
    },
    {
      title: 'Mượn liên TV',
      url: URL_ROUTER.contact,
    },
    {
      title: 'Liên hệ',
      url: URL_ROUTER.contact,
    },
  ];

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }
}
