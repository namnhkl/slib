import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  Validators,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProfileService } from '../profile.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
  ],
  styles: [
    `
      .ant-form-item-label {
        text-align: left;
      }
    `
  ]
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    constructor(
      private banDocsService: ProfileService,
      private notification: NzNotificationService,
      private router: Router,
    ) {}
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();

  // Biến toggle hiển thị mật khẩu
  showOldPassword = false;
  showPassword = false;
  showConfirm = false;
  isLoading = false;

  // Form nhóm
  validateForm = this.fb.group({
    oldPassword: this.fb.control('', Validators.required),
    password: this.fb.control('', [
      Validators.required,
      //Validators.minLength(6),
      //this.passwordStrengthValidator.bind(this),
    ]),
    checkPassword: this.fb.control('', [Validators.required, this.confirmationValidator.bind(this)]),
  });
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone',
  };

  ngOnInit(): void {
    // Khi thay đổi mật khẩu mới thì xác nhận mật khẩu phải cập nhật lại để so sánh
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.checkPassword.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

   // Hàm gọi API khi nhấn "Đổi mật khẩu"
   onSubmitChangePassword(): void {
    // Mark all fields as touched to trigger validation errors
  Object.values(this.validateForm.controls).forEach(control => {
    control.markAsTouched();
    control.updateValueAndValidity();
  });
    if (this.validateForm.valid) {
      const matKhauCu = this.validateForm.get('oldPassword')?.value;
      const matKhau = this.validateForm.get('password')?.value;
  
      if (typeof matKhauCu === 'string' && typeof matKhau === 'string') {
        this.isLoading = true; // BẮT ĐẦU loading
        this.banDocsService.bdBanDocDoiMatKhau(matKhauCu, matKhau).subscribe(
          (response) => {
            if(response.messageCode.toString() === "0"){
              this.createNotification("error", "Thông báo", response.messageText);
              console.error('Đổi mật khẩu thất bại', response.messageText);
            }
            else{
              this.createNotification("success", "Thông báo", "Mật khẩu đã được thay đổi thành công: ");
              console.log('Mật khẩu đã được thay đổi thành công', response);
              setTimeout(() => {
                this.logout();
              }, 1000);
            }
            
          },
          (error) => {
            this.createNotification("error", "Thông báo", "Đổi mật khẩu thất bại");
            console.error('Đổi mật khẩu thất bại', error);
          },
          () => {
            this.isLoading = false; // KẾT THÚC loading
          }
        );
      } else {
        this.createNotification("error", "Thông báo", "Mật khẩu không hợp lệ");
        console.error('Mật khẩu không hợp lệ');
      }
    } else {
      this.createNotification("error", "Thông báo", "Dữ liệu không hợp lệ");
      console.log('Dữ liệu không hợp lệ');
    }
  }
  
  // passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value || '';
  //   const hasUpperCase = /[A-Z]/.test(value);
  //   const hasLowerCase = /[a-z]/.test(value);
  //   const hasNumeric = /[0-9]/.test(value);
  //   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  //   const isValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && value.length >= 8;
  //   return isValid ? null : { passwordStrength: true };
  // }

  // So sánh mật khẩu mới và xác nhận mật khẩu
  confirmationValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return null;
  }

  createNotification(type: string,header: string, msg: string): void {
    this.notification.create(
      type,
      header,
      msg
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('appSession');
  
    // Chuyển về trang login
    this.router.navigateByUrl('login').then(() => {
      // Sau khi điều hướng xong thì reload lại trang
      window.location.reload();
    });
  }
  

}
