import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactService } from './contact.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ContactFormBody } from './type';
import { tap } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-contact',
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [ContactService]
})
export class ContactComponent {
  validateForm;

  constructor(private fb: NonNullableFormBuilder, private contactService: ContactService, private notificationService: NzNotificationService) {
    this.validateForm = this.fb.group({
      hoTen: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      noiDung: this.fb.control('', [Validators.required]),
      ip: this.fb.control('', [Validators.required]),
      thuVien: this.fb.control('1'),
    });
  }

  submitForm(): void {
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
