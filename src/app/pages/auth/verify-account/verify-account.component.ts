import { Component } from '@angular/core';
import { GlobalModule } from '../../../core/modules/global.module';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/service/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicPage } from '../../../core/shares/basic-page';
import { environment } from '../../../../environments/environment';
import { LinkRegisterForgotPasswordComponent } from '../components/link-register-forgot-password/link-register-forgot-password.component';
import { AuthService } from '../../../core/service/auth.service';
import { interval, takeWhile } from 'rxjs';
import { ResponseHandlerService } from '../../../core/service/response-handler.service';
import { FormEmailOtpChildComponent } from '../components/form-email-otp-child/form-email-otp-child.component';

@Component({
  selector: 'app-verify-account',
  imports: [
    GlobalModule,
    AuthLibModule,
    LinkRegisterForgotPasswordComponent,
    FormEmailOtpChildComponent,
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.scss',
})
export class VerifyAccountComponent extends BasicPage {
  virifyForm!: FormGroup;
  otpStatus: number = 0;

  constructor(
    private fb: FormBuilder,
    protected override globalSer: GlobalService,
    private authService: AuthService,
    private router: Router,
     private route: ActivatedRoute,
    private responseHandler: ResponseHandlerService
  ) {
    super(globalSer);
    this.createForm();
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.virifyForm.get('email')?.setValue(params['email']);
        // Tùy chọn: có thể disable field email nếu muốn
        this.virifyForm.get('email')?.disable();
      }
    });
  }

  createForm() {
    this.virifyForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onVerifyOtp() {
    if (this.virifyForm.valid) {
      this.globalSer.openLoading();
      this.authService.verifyRegisterOtp(this.virifyForm.value).subscribe({
        next: () => {
          this.responseHandler.handleSuccess(
            'auth.verify-account-success',
            () => {
              setTimeout(() => {
                this.router.navigate(['/auth/login']);
              }, 1000);
            }
          );
        },
        error: (error) => {
          this.responseHandler.handleError(error);
        },
      });
    }
  }

  goBack() {
    window.history.go(-1);
  }
}
