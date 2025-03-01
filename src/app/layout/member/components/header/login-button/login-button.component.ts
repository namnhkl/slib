import { AuthService } from '@/app/shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';

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
export class LoginButtonComponent implements OnInit {
  validateForm: FormGroup;
  isVisible = false;
  isAuthenticated$;
  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.validateForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(true),
    });
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnInit(): void {
    console.log('isAuthenticated$', this.isAuthenticated$);
  }

  async submitForm() {
    if (this.validateForm.valid) {
      const { username, password } = this.validateForm.value;
      this.authService
        .login({
          soThe: username,
          matKhau: password,
        })
        .subscribe({
          next: (res) => {
            console.log('res', res);
            if (res.messageCode) {
              this.authService.saveSession(res.data[0], res.accessToken);
              //redirect to profile after login
              this.router.navigate(['/profile']);
            } else {
              // eslint-disable-next-line no-alert
              alert(res.messageText || 'Sai tài khoản hoặc mật khẩu');
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

  logout() {
    this.authService.logout();
  }
}
