import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { LoginButtonComponent } from './login-button/login-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from '@/app/i18n/i18n.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
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
  language = 'vi-VN';

  constructor(private router: Router, private readonly _i18nService: I18nService,) {}

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }

  get languages(): string[] {
    return this._i18nService.supportedLanguages;
  }

  setLanguage(language: string) {
    this._i18nService.language = language;
  }

  changeLanguage(language: string) {
    console.log("🚀 ~ HeaderComponent ~ changeLanguage ~ language:", language)
    this._i18nService.language = language;
  }
}
