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
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

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
    NzDrawerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected links = [
    {
      title: 'home',
      url: URL_ROUTER.home,
    },
    {
      title: 'introduction',
      url: URL_ROUTER.about,
    },
    {
      title: 'news',
      url: URL_ROUTER.news,
    },
    {
      title: 'good_books',
      url: URL_ROUTER.documents,
    },
    {
      title: 'borrow_from_lien_tv',
      url: URL_ROUTER.contact,
    },
    {
      title: 'contact',
      url: URL_ROUTER.contact,
    },
  ];
  language = 'vi-VN';
  visible = false;

  constructor(
    private router: Router,
    private readonly _i18nService: I18nService
  ) {}

  ngOnInit() {
    this.language = this._i18nService.language;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }

  get languages(): string[] {
    return this._i18nService.supportedLanguages;
  }

  setLanguage(language: 'vi-VN' | 'en-US') {
    this._i18nService.language = language;
  }

  changeLanguage(language: string) {
    console.log("🚀 ~ HeaderComponent ~ setLanguage ~ language:", language)
    this._i18nService.language = language;
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
}
