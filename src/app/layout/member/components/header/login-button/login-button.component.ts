/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable id-length */
/* eslint-disable newline-before-return */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AuthService, DangKyTaiKhoanRequest } from '@/app/shared/services/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { DanhmucService } from '@/app/shared/services/danhmuc.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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
    NzStepsModule,
    NzIconModule,
    NzSelectModule,
    NzRadioModule,
    NzDatePickerModule 
  ],
})
export class LoginButtonComponent implements AfterViewInit,OnInit, OnChanges  {
  validateForm: FormGroup;
  isVisible = false;
  isAuthenticated$;
  currentUrl: string = '/';
  forgotPasswordVisible = false;
  currentStep = 0;
  showPassword = false;
  showConfirmPassword = false;
   isMobile = false;
  @ViewChild('captchaCanvas', { static: false }) captchaCanvas!: ElementRef<HTMLCanvasElement>;

  captchaCode: string = '';

registerForm: FormGroup;
registerVisible = false;
thuVienList: { id: string; tenThuVien: string }[] = [];

  forgotPasswordForm: FormGroup;
  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NzNotificationService, private translate: TranslateService,
    private datePipe: DatePipe,
    private  danhmucService: DanhmucService,
    private breakpointObserver: BreakpointObserver
  ) {
      this.forgotPasswordForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        soThe: [null],
        maBaoMat: [null],
        matKhau: [null, [Validators.required, Validators.minLength(6)]],
        nhapLaiMatKhau: [null, [Validators.required]],
      }, {
        validators: this.passwordMatchValidator 
      });



    this.validateForm = this.fb.group({
      username: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      remember: this.fb.control(false),
    });

    this.registerForm = this.fb.group({
      bsThuVienId: [null, Validators.required],
      hoTen: ['', Validators.required],
      gioiTinh: [true],
      ngaySinh: [null],
      email: ['', [Validators.required, Validators.email]],
      captchaText: ['', Validators.required],
    });

    this.isAuthenticated$ = this.authService.isAuthenticated$;
        this.forgotPasswordForm.get('matKhau')?.valueChanges.subscribe(() => {
    this.forgotPasswordForm.get('nhapLaiMatKhau')?.updateValueAndValidity();
});
  }

ngAfterViewInit(): void {
    this.generateCaptcha(); // gọi ở đây thay vì ngOnInit
  }
  
  ngOnInit(): void {
     this.authService.setRedirectUrl(this.router.url);
    console.log('isAuthenticated$', this.isAuthenticated$);
    this.loadThuVienList();
     this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
    

  }

  loadThuVienList(): void {
  this.danhmucService.getThuvien().subscribe({
    next: (response) => {
      if (response && response.messageCode === 1 && Array.isArray(response.data)) {
        this.thuVienList = response.data.map((item: any) => ({
          id: item.id,
          tenThuVien: item.ten
        }));
      } else {
        this.thuVienList = [];
      }
    },
    error: (err) => {
      console.error('Lấy dữ liệu thư viện lỗi:', err);
      this.thuVienList = [];
    }
  });
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
  this.router.navigateByUrl('/profile').then(() => {
    window.location.reload();
  });
}

  ngOnChanges() {
    console.log('isAuthenticated123$', this.isAuthenticated$);
  }

openForgotPasswordModal(): void {
  this.isVisible = false;
  this.forgotPasswordVisible = true;
  this.currentStep = 0;
  this.forgotPasswordForm.reset();
}

handleForgotCancel(): void {
  this.forgotPasswordVisible = false;
}

handleStep1(): void {
  if (this.forgotPasswordForm.get('soThe')?.invalid || this.forgotPasswordForm.get('email')?.invalid) {
    this.forgotPasswordForm.markAllAsTouched(); // Hiển thị lỗi
    return;
  }

  const { soThe, email } = this.forgotPasswordForm.value;

  this.authService.quenMatKhauLayMaBaoMat({ soThe, email }).subscribe({
    next: (response) => {
      if (response?.messageCode === 1) {
        this.notificationService.success(this.translate.instant('success'), this.translate.instant('security_code_sent'));
        this.currentStep = 1;
      } else {
        this.notificationService.error(this.translate.instant('error'), response?.messageText || 'Gửi mã bảo mật thất bại');
      }
    },
    error: () => {
      this.notificationService.error(this.translate.instant('error'), this.translate.instant('cannot_send_security_code'));
    },
  });
}


handleStep2(): void {
  const { email, maBaoMat } = this.forgotPasswordForm.value;

  this.authService.xacNhanMaBaoMat({ email, maBaoMat }).subscribe({
    next: (response) => {
      if (response?.messageCode === 1) {
        this.notificationService.success(this.translate.instant('success'), this.translate.instant('verification_code_valid'));
        this.currentStep = 2;
      } else {
        this.notificationService.error(this.translate.instant('error'), response?.messageText || 'Mã xác nhận không hợp lệ');
      }
    },
    error: () => {
      this.notificationService.error(this.translate.instant('error'), this.translate.instant('cannot_verify_code'));
    },
  });
}


handleStep3(): void {
  const { email, maBaoMat, matKhau } = this.forgotPasswordForm.value;

  this.authService.doiMatKhau({ email, maBaoMat, matKhau }).subscribe({
    next: (response) => {
      if (response?.messageCode === 1) {
        this.notificationService.success(this.translate.instant('success'), this.translate.instant('password_changed'));
        this.forgotPasswordVisible = false;
      } else {
        this.notificationService.error(this.translate.instant('error'), response?.messageText || 'Không thể đổi mật khẩu');
      }
    },
    error: () => {
      this.notificationService.error(this.translate.instant('error'), this.translate.instant('error'));
    },
  });
}


handleRegisterCancel(): void {
  this.registerVisible = false;
}

showRegisterModal(): void {
  this.isVisible = false;
  this.registerForm.reset();
  this.registerVisible = true;
  // Đợi DOM cập nhật sau khi modal mở
  setTimeout(() => {
    this.generateCaptcha();
  }, 0);
}

submitRegisterForm(): void {
  if (this.registerForm.valid) {
      const userCaptcha = this.registerForm.value.captchaText?.trim();
      if (userCaptcha !== this.captchaCode) {
        this.notificationService.error(
          this.translate.instant('error'),
          this.translate.instant('wrong_captcha')
        );
        this.generateCaptcha(); // tạo lại
        return;
      }

    const formValue = this.registerForm.value;

    const body = new DangKyTaiKhoanRequest();
    body.bsThuVienId = formValue.bsThuVienId;
    body.hoTen = formValue.hoTen;
    body.gioiTinh = Number(formValue.gioiTinh);
    body.ngaySinh = this.datePipe.transform(formValue.ngaySinh, 'dd/MM/yyyy') ?? '';
    body.email = formValue.email;
    body.dienThoai = formValue.dienThoai || '';
    body.bdDmQuocGiaId = formValue.bdDmQuocGiaId || '';
    body.bdDmTinhThanhId = formValue.bdDmTinhThanhId || '';
    body.diaChi = formValue.diaChi || '';
    body.bdDmDanTocId = formValue.bdDmDanTocId || '';
    body.bdDmTrinhDoVanHoaId = formValue.bdDmTrinhDoVanHoaId || '';
    body.bdDmNgheNghiepId = formValue.bdDmNgheNghiepId || '';
    body.bdDmThanhPhanXaHoiId = formValue.bdDmThanhPhanXaHoiId || '';

    this.authService.dangKyTaiKhoan(body).subscribe(res => {
      if (res.messageCode === 1) {
        this.notificationService.success(
          this.translate.instant('success'),
          this.translate.instant(res.messageText)
        );
        this.registerVisible = false;
      } else {
        this.notificationService.error(
          this.translate.instant('error'),
          res.messageText || 'Đăng ký không thành công'
        );
      }
    });
  } else {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility(): void {
  this.showConfirmPassword = !this.showConfirmPassword;
}

passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const form = control as FormGroup;
  const password = form.get('matKhau')?.value;
  const confirmPassword = form.get('nhapLaiMatKhau')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

generateCaptcha(): void {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ O và 0 dễ nhầm
  this.captchaCode = '';
  for (let i = 0; i < 5; i++) {
    this.captchaCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const canvas = this.captchaCanvas.nativeElement;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nền
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ mã
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000';
    ctx.setTransform(1, 0.1, -0.1, 1, 0, 0); // nhẹ biến dạng
    ctx.fillText(this.captchaCode, 15, 30);

    // Nhiễu
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 40);
      ctx.lineTo(Math.random() * 120, Math.random() * 40);
      ctx.strokeStyle = '#ccc';
      ctx.stroke();
    }
  }
}

}
