import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { MenubarComponent } from './components/menubar/menubar.component';
// import { HeaderComponent } from './components/header/header.component';
import { LoaderService } from '@/app/shared/services/loader.service';
import { URL_ROUTER } from '../../shared/constants/path.constants';
import { ProfileComponent } from './components/profile/profile.component';

@Component({
  selector: 'app-member',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MenubarComponent,
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzPopoverModule,
    NzModalModule,
    NzButtonModule,
    ProfileComponent,
    NzIconModule, 
    NzSpinModule
  ],
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss',
})
export class MemberComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isSpinning = false;
  permissionsData!: Record<string, boolean>;

  constructor(
    private router: Router,
    private confirm: NzModalService,
    private loadingService: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.loadingService.getLoading$().subscribe((res) => {
      this.isSpinning = res;
      this.cdr.detectChanges();
    });
    // this.loadingService.setLoading(true);

    // setTimeout(() => {
    //   this.loadingService.setLoading(false);
    // }, 5000);
  }

  logout() {
    this.confirm.confirm({
      nzTitle: 'Đăng xuất',
      nzContent: 'Bạn chắc chắn muốn đăng xuất?',
      nzOkText: 'Đăng xuất',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_in');
        localStorage.removeItem('username');
        this.router.navigate([URL_ROUTER.login]);
      },
      nzOnCancel: () => {},
    });
  }

  ShowHideSider(isCollaps: any) {
    this.isCollapsed = isCollaps;
  }

  // showNavbar(menu: NavbarItems[]) {
  //    this.menuItems = hideOrShowNavbar(menu, permission);
  // }
}
