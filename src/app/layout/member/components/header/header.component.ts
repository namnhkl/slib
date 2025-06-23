import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { URL_ROUTER } from '@/app/shared/constants/path.constants';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { LoginButtonComponent } from './login-button/login-button.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { I18nService } from '@/app/i18n/i18n.service';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { BreadcrumbComponent } from '@/app/shared/components/breadcrumb/breadcrumb.component';
import { GioiThieuService } from '@/app/shared/services/gioithieu';
import { SharedService } from '@/app/shared/services/shared.service';
import { TienIchKhacService } from '@/app/shared/services/tienichkhac';

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
  // protected links = [
  //   {
  //     title: 'home',
  //     url: URL_ROUTER.home,
  //   },
  //   {
  //     title: 'introduction',
  //     url: URL_ROUTER.intro,
  //     children: []

  //   },
  //   {
  //     title: 'news',
  //     url: URL_ROUTER.QtndTinTuc,
  //   },
  //   {
  //     title: 'good_books',
  //     url: URL_ROUTER.sachhay,
  //   },
  //   {
  //     title: 'menu_vbqp_phapluat',
  //     url: URL_ROUTER.vbqpphapluat,
  //   },
  //   {
  //     title: 'contact',
  //     url: URL_ROUTER.contact,
  //   },
  // ];
  language = 'vi-VN';
  htNgonNgu: number = 1;
  visible = false;
  public openDropdownIndex: number | null = null;
  public openMobileDropdownIndex: number | null = null;

  menus: any[] = [];
  treeMenus: any[] = [];

  constructor(
    private router: Router,
    private readonly _i18nService: I18nService,
    private gioiThieuService: GioiThieuService,
    private sharedService: SharedService,
    private translate: TranslateService,
    private tienichKhacService: TienIchKhacService
  ) { }

  ngOnInit() {
    this.language = this._i18nService.language;
    this.htNgonNgu = this.language === 'vi-VN' ? 1 : 2; // THIẾT YẾU
    this.getMenus(); // Lấy menu khi khởi tạo
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }

  get languages(): string[] {
    return this._i18nService.supportedLanguages;
  }

getMenus() {
  this.tienichKhacService.qtndQlThanhChucNang({
    bsThuVienId: this.sharedService.thuVienId,
    qtndHtNgonNguId: this.htNgonNgu
  }).subscribe({
    next: (res: any) => {
      this.menus = res?.data || [];
      this.treeMenus = this.buildTreeMenu(this.menus);
      console.log('Danh sách menu:', this.treeMenus);
    },
    error: (err) => {
      console.error('Lỗi khi lấy danh sách menu:', err);
    }
  });
}

buildTreeMenu(flatMenu: any[], parentId: string = '0'): any[] {
  return flatMenu
    .filter(item => item.qtndHtThanhChucNangId === parentId)
    .sort((a, b) => a.sapXep - b.sapXep)
    .map(item => ({
      title: item.ten,
      url: this.sanitizeUrl(item.duongDan),
      target: item.moCuaSoMoi === 1 ? '_blank' : '_self',
      children: this.buildTreeMenu(flatMenu, item.id)
    }));
}

sanitizeUrl(url: string): string {
  try {
    console.log('Decoded URL:', decodeURIComponent(url));
    return decodeURIComponent(url);
    
  } catch {
    return url;
  }
}




setLanguage(language: 'vi-VN' | 'en-US') {
  this._i18nService.language = language;
  this.htNgonNgu = language === 'vi-VN' ? 1 : 2;
  this.language = language;
  this.getMenus(); // Lấy lại menu sau khi đổi ngôn ngữ
}
 changeLanguage(language: 'vi-VN' | 'en-US') {
  this._i18nService.language = language;
  this.language = language;
  this.htNgonNgu = language === 'vi-VN' ? 1 : 2; // THIẾT YẾU
this.getMenus(); // Lấy lại menu sau khi đổi ngôn ngữ
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

  isExternal(url: string): boolean {
  return url.startsWith('http') || url.includes('://') || url.includes('?');
}

getRouterLink(url: string): any[] {
  const [path] = url.split('?');
  return ['/', path];
}

getQueryParams(url: string): { [key: string]: string } | undefined {
  const [, queryString] = url.split('?');
  if (!queryString) return undefined;

  return Object.fromEntries(new URLSearchParams(queryString));
}

isExternalLink(url: string): boolean {
  return url.startsWith('http') || url.includes('://') || url.includes('?');
}


}
