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
import { BreadcrumbComponent } from '@/app/shared/components/breadcrumb/breadcrumb.component';
import { GioiThieuService } from '@/app/shared/services/gioithieu';
import { SharedService } from '@/app/shared/services/shared.service';

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
    NzDrawerModule,
    BreadcrumbComponent,
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
      url: URL_ROUTER.intro,
      children: []

    },
    {
      title: 'news',
      url: URL_ROUTER.QtndTinTuc,
    },
    {
      title: 'good_books',
      url: URL_ROUTER.searchResult,
    },
    {
      title: 'menu_vbqp_phapluat',
      url: URL_ROUTER.vbqpphapluat,
    },
    {
      title: 'contact',
      url: URL_ROUTER.contact,
    },
  ];
  language = 'vi-VN';
  htNgonNgu: number = 1;
  visible = false;
  public openDropdownIndex: number | null = null;
  public openMobileDropdownIndex: number | null = null;

  constructor(
    private router: Router,
    private readonly _i18nService: I18nService,
    private gioiThieuService: GioiThieuService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.language = this._i18nService.language;
    this.loadIntroductionChildren();
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
  this.htNgonNgu = language === 'vi-VN' ? 1 : 2;
  this.loadIntroductionChildren();
}
 changeLanguage(language: 'vi-VN' | 'en-US') {
  this._i18nService.language = language;
  this.language = language;
  this.htNgonNgu = language === 'vi-VN' ? 1 : 2; // THIẾT YẾU
  this.loadIntroductionChildren(); // gọi lại API
}

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  toggleDropdown(index: number) {
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  toggleMobileDropdown(index: number) {
    this.openMobileDropdownIndex = this.openMobileDropdownIndex === index ? null : index;
  }

  private isLoadingIntroChildren = false;

loadIntroductionChildren() {
  if (this.isLoadingIntroChildren) return; // tránh gọi trùng
  this.isLoadingIntroChildren = true;

  this.gioiThieuService.qtndGioiThieu({
    bsThuVienId: this.sharedService.thuVienId,
    qtndHtNgonNguId: this.htNgonNgu
  }).subscribe({
    next: (res: any) => {
      const introMenuIndex = this.links.findIndex(link => link.title === 'introduction');
      if (introMenuIndex !== -1 && res?.data?.length) {
        const updatedChildren = res.data.map((item: any) => ({
          title: item.ten,
          url: '/gioi-thieu-chi-tiet',
          queryParams: { id: item.id }
        }));

        // Clone toàn bộ mảng links
        const newLinks = [...this.links];

        // Clone object menu "introduction" và gán children mới
        newLinks[introMenuIndex] = {
          ...newLinks[introMenuIndex],
          children: updatedChildren
        };

        this.links = newLinks; // Gán lại để Angular detect thay đổi
      }

      this.isLoadingIntroChildren = false;
    },
    error: () => {
      this.isLoadingIntroChildren = false;
    }
  });
}

}
