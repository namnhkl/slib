import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, TranslateModule, RouterModule, NzSelectModule],
  standalone: true,
})
export class HeaderComponent {
  currentLang = 'en';
  currentRoute: string = '';
  constructor(private translate: TranslateService, private router: Router) {
    this.translate.setDefaultLang('en');
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}
