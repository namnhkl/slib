import { AuthService } from '@/app/shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
  imports: [
    CommonModule,
    NzButtonModule,
    TranslateModule,
    NzModalModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
  ],
})
export class LoginButtonComponent implements OnInit, OnChanges {
  validateForm: FormGroup;
  isVisible = false;
  isAuthenticated$;
  currentUrl: string = '/';
  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NzNotificationService, private translate: TranslateService
  ) {
    this.validateForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(false),
    });
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
     this.authService.setRedirectUrl(this.router.url);
    console.log('isAuthenticated$', this.isAuthenticated$);
  }

  async submitForm() {
    if (this.validateForm.valid) {
      const { username, password, remember } = this.validateForm.value;
      this.authService
      .login({
        soThe: username,
        matKhau: password,
      })
      .subscribe({
        next: (res) => {
          if (res.messageCode) {
            this.authService.saveSession(res.data[0], res.accessToken, remember);

            // Quay lại URL cũ nếu có, ngược lại về trang chủ
            // this.router.navigateByUrl(this.currentUrl || '/');
            const redirectUrl = this.authService.getRedirectUrl() || '/';
            window.location.href = redirectUrl;

          } else {
             this.notificationService.error(this.translate.instant('error'), this.translate.instant('incorrect_password_or_account'));
          }
          this.isVisible = false;
        },
        error: (err) => {
          console.log('err', err);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  showModal(): void {
    this.authService.setRedirectUrl(this.router.url);
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  goProfile() {
    this.router.navigate(['/profile']);
  }

  ngOnChanges() {
    console.log('isAuthenticated123$', this.isAuthenticated$);
  }
}
