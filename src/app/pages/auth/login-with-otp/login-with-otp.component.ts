import { Component } from '@angular/core';
import { GlobalModule } from '../../../core/modules/global.module';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/service/global.service';
import { Router } from '@angular/router';
import { BasicPage } from '../../../core/shares/basic-page';
import { environment } from '../../../../environments/environment';
import { LinkRegisterForgotPasswordComponent } from "../components/link-register-forgot-password/link-register-forgot-password.component";
import { AuthService } from '../../../core/service/auth.service';
import { catchError, filter, finalize, interval, of, switchMap, take, takeWhile, timeout } from 'rxjs';
import { ResponseHandlerService } from '../../../core/service/response-handler.service';
import { FormEmailOtpChildComponent } from "../components/form-email-otp-child/form-email-otp-child.component";

@Component({
  selector: 'app-login-with-otp',
  imports: [GlobalModule, AuthLibModule, LinkRegisterForgotPasswordComponent, FormEmailOtpChildComponent],
  templateUrl: './login-with-otp.component.html',
  styleUrl: './login-with-otp.component.scss',
})
export class LoginWithOtpComponent extends BasicPage {
  loginForm!: FormGroup;
  otpStatus: number = 0;

  constructor(
    private fb: FormBuilder,
    protected override globalSer: GlobalService,
    private authService: AuthService,
    private router: Router,
    private responseHandler: ResponseHandlerService
  ) {
    super(globalSer);
    this.createForm();
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.loginForm.patchValue({
        email: 'tranthanh0898256009@gmail.com',
      });
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  onLogin() {
  if (this.loginForm.valid) {
    const data = this.loginForm.value;
    console.log('Form data:', data);
    this.globalSer.openLoading();

    const subscription = this.authService.loginByOtp(data)
      .pipe(
        // Chuyển sang theo dõi API fetchFullUserInfo
        // (đã được gọi tự động trong loginByOtp)
        switchMap(() => {
          // Đợi thông tin người dùng được cập nhật từ currentUser$
          // Lấy giá trị đầu tiên khác null
          return this.authService.currentUser$.pipe(
            // Lọc ra các giá trị null
            filter(user => !!user),
            // Chỉ lấy giá trị đầu tiên
            take(1),
            // Đặt timeout 5 giây
            timeout(5000),
            // Nếu timeout hoặc lỗi, vẫn tiếp tục
            catchError(err => {
              console.warn('Could not get full user info after OTP login, continuing with basic info:', err);
              return of(null);
            })
          );
        }),
        // Đảm bảo đóng loading trong mọi trường hợp
        finalize(() => this.globalSer.closeLoading())
      )
      .subscribe({
        next: () => {
          this.responseHandler.handleSuccess('auth.login-success', () => {
            this.router.navigate(['/manager-file/my-files']);
          });
        },
        error: (error) => {
          this.responseHandler.handleErrorWithUnverifiedCheck(
            error,
            () => this.loginForm.get('email')?.value
          );
        }
      });

    // Thêm subscription vào mảng _subscriptions để dọn dẹp sau này
    this._subscriptions.push(subscription);
  }
}

  goBack() {
    window.history.go(-1);
  }
}

