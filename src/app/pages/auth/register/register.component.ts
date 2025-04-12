import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/service/global.server';
import { BasicPage } from '../../../core/shares/basic-page';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PasswordValidators } from '../../../core/validators/password.validator';

@Component({
  selector: 'app-register',
  imports: [GlobalModule, AuthLibModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent extends BasicPage {
  registerForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    protected override globalSer: GlobalService
  ) {
    super(globalSer);
    this.createForm();
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.registerForm.patchValue({
        fullName: 'Trần Xuân Thành',
        phone: '0123456789',
        email: 'tranxuanthanhtxt2002@gamil.com',
        password: 'Thanh2002@',
        confirmPassword: 'Thanh2002@',
      });
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      // Xử lý form khi hợp lệ
      console.log(this.registerForm.value);
    } else {
      // Đánh dấu tất cả các trường là đã touched để hiển thị lỗi
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            ...PasswordValidators.strongPassword(),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: PasswordValidators.passwordMatch(),
      }
    );
  }

  // Phương thức để kiểm tra lỗi
  hasError(controlName: string, errorName: string): boolean {
    const control = this.registerForm.get(controlName);
    return (
      !!control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched)
    );
  }

  hasPasswordMismatch(): boolean | undefined {
    return (
      this.registerForm.hasError('passwordMismatch') &&
      this.registerForm.get('confirmPassword')?.dirty
    );
  }
}
