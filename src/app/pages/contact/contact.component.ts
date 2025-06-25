import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ContactFormBody } from './type';
import { BehaviorSubject, map, tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CategoryService } from './category.service';
import _ from 'lodash';
import { AsyncPipe, CommonModule } from '@angular/common';
import { generateUniqueSixDigitNumber } from './utils';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    AsyncPipe,
    TranslateModule,
    CommonModule
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [ContactService, CategoryService]
})
export class ContactComponent {
  validateForm;

  categoryService = inject(CategoryService);

  $capcha = (new BehaviorSubject(generateUniqueSixDigitNumber()));

  constructor(private fb: NonNullableFormBuilder, private contactService: ContactService, private notificationService: NzNotificationService, private translate: TranslateService) {
    this.validateForm = this.fb.group({
      hoTen: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      noiDung: this.fb.control('', [Validators.required]),
      ip: this.fb.control('', [Validators.required]),
      thuVien: this.fb.control('', [Validators.required]),
    });
  }

  $optionsCategory = this.categoryService.getCategory().pipe(
    map(res => {
      if (res.messageCode === 1) {
        return _.get(res, 'data', [])
      }

      return []
    })
  )

  handleResetCapcha() {
    this.$capcha.next(generateUniqueSixDigitNumber())
  }

  submitForm(): void {
    //  console.log('Form submitted', this.validateForm.value); // Kiểm tra
    if (this.validateForm.valid) {
      const isCapchaValid = _.isEqual(this.validateForm.get('ip')?.value, this.$capcha.value.join(''));
      // console.log('CAPTCHA input:', this.validateForm.get('ip')?.value);
      // console.log('CAPTCHA actual:', this.$capcha.value.join(''));
      if (!isCapchaValid) {
        this.validateForm.controls['ip'].setErrors({
          notMatch: true
        })

        setTimeout(() => {
          this.validateForm.controls['ip'].setValue('');
          this.handleResetCapcha()
        }, 500)

        return;
      }
      // console.log('Sending to server:', this.validateForm.value);
      this.contactService.submitContactContent(this.validateForm.value as ContactFormBody)
      .pipe(
        tap(res => {
          if (res.messageCode === 1) {
            this.notificationService.success(this.translate.instant('success'), this.translate.instant('feedback_sent_successfully'));
            this.validateForm.reset();
            this.handleResetCapcha()
          }
          else{
            this.notificationService.error(this.translate.instant('failure'), this.translate.instant('sending_feedback_failed'));
          }
        })
      )
      .subscribe();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
