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
import { interval, takeWhile } from 'rxjs';
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
      this._subscriptions.push(
        this.authService.loginByOtp(data).subscribe({
          next: () => {
            this.responseHandler.handleSuccess('auth.login-success', () => {
              this.router.navigate(['/manager-file/home']);
            });
          },
          error: (error) => {
            this.responseHandler.handleErrorWithUnverifiedCheck(
              error,
              () => this.loginForm.get('email')?.value
            );
          },
        })
      );
    }
  }

  goBack() {
    window.history.go(-1);
  }
}

