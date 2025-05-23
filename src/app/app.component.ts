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
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isSpinning = false;
  constructor(
    injector: Injector,
    private readonly _i18nService: I18nService,
    private loadingService: LoaderService,
    private cdr: ChangeDetectorRef
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


}
