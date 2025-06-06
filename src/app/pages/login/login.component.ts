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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private loginService: LoginService,
    private commonService: CommonService
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
        [ExtendValidators.customRequired('Tài khoản không được để trống')],
      ],
      password: [
        '',
        [ExtendValidators.customRequired('Mật khẩu không được để trống')],
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

    this.loginService.login(this.loginModel).subscribe(
      (res: HttpResponse<any>) => {
        if (this.commonService.checkStausByCode(res.status)) {
          if (res.body.accessToken) {
            const accessToken = res.body.accessToken;
            const expiresIn = res.body.expireTime ?? ''; // nếu có expireTime từ backend

            // ✅ Chọn nơi lưu token tùy theo 'remember'
            if (this.form?.value.remember) {
              // Ghi nhớ: Lưu vào localStorage (giữ lâu)
              localStorage.setItem('access_token', accessToken);
              localStorage.setItem('expires_in', expiresIn);
            } else {
              // Không nhớ: Lưu vào sessionStorage (tự xóa khi đóng tab)
              sessionStorage.setItem('access_token', accessToken);
              sessionStorage.setItem('expires_in', expiresIn);
            }

            this.router.navigate(['/']);
          }
        } else {
          console.error('Request failed with error:', res);
          this.loginError = res.statusText;
          this.isLoading = false;
        }
      },
      (error) => {
        this.isLoading = false;
        if (error.status === 0) this.loginError = 'Lỗi kết nối!';
        else this.loginError = error.error.problemDetails.errors[0].message;
        console.error(
          'Request failed with error:',
          error.error.problemDetails.errors[0].message
        );
      }
    );
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
