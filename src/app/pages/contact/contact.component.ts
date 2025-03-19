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
import { AsyncPipe } from '@angular/common';
import { generateUniqueSixDigitNumber } from './utils';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    AsyncPipe
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [ContactService, CategoryService]
})
export class ContactComponent {
  validateForm;

  categoryService = inject(CategoryService);

  $capcha = (new BehaviorSubject(generateUniqueSixDigitNumber()));

  constructor(private fb: NonNullableFormBuilder, private contactService: ContactService, private notificationService: NzNotificationService) {
    this.validateForm = this.fb.group({
      hoTen: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      noiDung: this.fb.control('', [Validators.required]),
      ip: this.fb.control('', [Validators.required]),
      thuVien: this.fb.control('1'),
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
    const isCapchaValid = _.isEqual(this.validateForm.get('ip')?.value, this.$capcha.value.join(''));

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

    if (this.validateForm.valid) {
      this.contactService.submitContactContent(this.validateForm.value as ContactFormBody)
      .pipe(
        tap(res => {
          if (res.messageCode === 1) {
            this.notificationService.success('Thành công', res.messageText)
            this.validateForm.reset();
          }
          else{
            this.notificationService.error('Thất bại', res.messageText)
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
