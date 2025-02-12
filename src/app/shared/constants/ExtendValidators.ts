import { NzSafeAny } from 'ng-zorro-antd/core/types';
import {
  AbstractControl, ValidationErrors, ValidatorFn, Validators,
} from '@angular/forms';

function isEmptyInputValue(value: NzSafeAny): boolean {
  return value === null || value.length === 0;
}

function isMobile(value: string): boolean {
  return typeof value === 'string' && /(^1\d{10}$)/.test(value);
}
export type MyErrorsOptions = { en: string } & Record<string, NzSafeAny>;
export interface MyValidationErrors extends ValidationErrors {
  mobile?: { en: string };
}

export class ExtendValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { en: `Nhập ít nhất ${minLength} ký tự` } };
    };
  }

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { en: `Nhập không quá ${maxLength} ký tự` } };
    };
  }

  static customRequired(message: string): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      const { value } = control;

      // Kiểm tra giá trị trường, nếu rỗng thì trả về lỗi với thông báo truyền vào
      if (value === null || value.trim() === '') {
        return { required: { en: message || 'Thông tin bắt buộc' } };
      }

      // Nếu không có lỗi
      return null;
    };
  }

  static mobile(control: AbstractControl): MyValidationErrors | null {
    const { value } = control;

    if (isEmptyInputValue(value)) {
      return null;
    }

    return isMobile(value)
      ? null
      : { mobile: { en: 'Số điện thoại không đúng' } };
  }
}
