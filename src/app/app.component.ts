import {
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { InjectorService } from './shared/services/injector.service';
import { HeaderComponent } from './layout/member/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { I18nService } from './i18n/i18n.service';
import { LoaderService } from './shared/services/loader.service';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { SharedModule } from './shared/shared.module';
import { ChatbotComponent } from './shared/components/chatbot/chatbot.component';
import { environment } from '../environments/environment';
import { BreadcrumbComponent } from './shared/components/breadcrumb/breadcrumb.component';
import { DatePipe } from '@angular/common';
import { SharedService } from './shared/services/shared.service';
import { QtndTinTucCarouselComponent } from './pages/QtndTinTuc/qtndtintuc-carousel/qtndtintuc-carousel.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    SharedModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzPopoverModule,
    NzModalModule,
    NzButtonModule,
    HeaderComponent,
    FooterComponent,
    NzSpinModule,
    ChatbotComponent,
    BreadcrumbComponent,
    QtndTinTucCarouselComponent,
    DatePipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isChatbotActive = environment.isActiveChatbot;
  isCollapsed = false;
  isSpinning = false;
  constructor(
    injector: Injector,
    private readonly _i18nService: I18nService,
    private loadingService: LoaderService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService
  ) {
    InjectorService.setInjector(injector);
  }
  ngOnInit() {
    // Initialize i18nService with default language and supported languages
    this._i18nService.init('vi-VN', ['vi-VN', 'en-US']);
    this.loadingService.getLoading$().subscribe((res) => {
      this.isSpinning = res;
      this.cdr.detectChanges();
    });
    this.sharedService.initThuVien();
  //   // Cấm chuột phải
  // document.addEventListener('contextmenu', (e) => e.preventDefault());

  // // Cấm phím F12, Ctrl+Shift+I, Ctrl+U
  // document.addEventListener('keydown', (e) => {
  //   if (
  //     e.key === 'F12' ||
  //     (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
  //     (e.ctrlKey && e.key === 'U')
  //   ) {
  //     e.preventDefault();
  //   }
  // });

  // // Phát hiện mở DevTools
  // this.detectDevTools();
  }

  handleActive() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  ngOnDestroy(): void {
    this._i18nService.destroy();
  }

  // private detectDevTools() {
  //   setInterval(() => {
  //     const start = new Date();
  //     debugger;
  //     const end = new Date();
  //     if (end.getTime() - start.getTime() > 100) {
  //       document.body.innerHTML = '';
  //       alert('DevTools bị phát hiện. Nội dung đã bị xóa.');
  //     }
  //   }, 3000); // kiểm tra mỗi 3s
  // }

}
