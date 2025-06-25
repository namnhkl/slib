import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { HttpResponse } from '@angular/common/http';
import { ExtendValidators } from '../../shared/constants/ExtendValidators';
import { LoginService } from './services/LoginService';
import { CommonService } from '../../shared/services/common.service';
import { LoginModel } from './model/login-model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '@/app/shared/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzLayoutModule,
    TranslateModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private loginService: LoginService,
    private commonService: CommonService,
    private authService: AuthService,
    private notificationService: NzNotificationService,
    private translate: TranslateService
  ) {}

  ngOnDestroy(): void {
    this.commonService.stop();
  }

  form?: FormGroup;

  loginError: string = '';

  isLoading: boolean = false;

  loginModel?: LoginModel;

  // form
  public get f(): { [key: string]: AbstractControl } {
    return this.form!.controls;
  }

  ngOnInit(): void {
    this.formInit();
  }

  formInit(): void {
    this.form = this.fb.group({
      userName: [
        '',
        [ExtendValidators.customRequired(this.translate.instant('please_input_your_username'))],
      ],
      password: [
        '',
        [ExtendValidators.customRequired(this.translate.instant('please_input_your_password'))],
      ],
      remember: [false],
      isMember: [false],
    });
  }

  login(event: Event) {
  this.isLoading = true;
  if (this.form!.valid) {
    event.preventDefault();
    this.loginModel = {
      userName: this.form?.value.userName,
      password: this.form?.value.password,
      rememberMe: this.form?.value.remember,
    };

    this.authService.login({soThe: this.loginModel.userName, matKhau: this.loginModel.password})
   .subscribe({
        next: (res) => {
          if (res.messageCode) {
            this.authService.saveSession(res.data[0], res.accessToken, this.form?.value.remember);

            // Quay lại URL cũ nếu có, ngược lại về trang chủ
            // this.router.navigateByUrl(this.currentUrl || '/');
            const redirectUrl = this.authService.getRedirectUrl() || '/';
            window.location.href = redirectUrl;

          } else {
             this.notificationService.error(this.translate.instant('error'), this.translate.instant('incorrect_password_or_account'));
          }
        },
        error: (err) => {
          // console.log('err', err);
        },
      });
  } else {
    Object.values(this.form!.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
    this.isLoading = false;
  }
}

}
