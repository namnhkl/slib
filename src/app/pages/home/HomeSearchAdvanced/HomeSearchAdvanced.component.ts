import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-home-search-advanced',
  templateUrl: './HomeSearchAdvanced.component.html',
  styleUrls: ['./HomeSearchAdvanced.component.scss'],
  imports: [
    NzButtonModule,
    NzModalModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
})
export class HomeSearchAdvancedComponent implements OnInit {
  validateForm: FormGroup;
  isVisible = false;
  constructor(private fb: NonNullableFormBuilder) {
    this.validateForm = this.fb.group({
      label: this.fb.control('', []),
      author: this.fb.control('', []),
      type: this.fb.control('', []),
      language: this.fb.control('', []),
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
    this.isVisible = false;
  }

  ngOnInit() {
    console.log('LoginButtonComponent');
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

  handleReset(): void {
    this.validateForm.reset();
  }

}
