import { Component } from '@angular/core';
import { BasicPage } from '../../../core/shares/basic-page';
import { GlobalService } from '../../../core/service/global.service';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LinkRegisterForgotPasswordComponent } from "../components/link-register-forgot-password/link-register-forgot-password.component";
import { AuthService } from '../../../core/service/auth.service';
import { CustomToastService } from '../../../core/service/custom-toast.service';
import { ResponseHandlerService } from '../../../core/service/response-handler.service';


@Component({
  selector: 'app-login-with-password',
  imports: [
    GlobalModule,
    AuthLibModule,
    TranslateModule,
    LinkRegisterForgotPasswordComponent,
  ],
  templateUrl: './login-with-password.component.html',
  styleUrl: './login-with-password.component.scss',
})
export class LoginWithPasswordComponent extends BasicPage {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    protected override globalSer: GlobalService,
    private router: Router,
    private authService: AuthService,
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
        userName: 'tranxuanthanhtxt2002@gmail.com',
        password: 'Thanh2002@',
      });
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  loginByPassword() {
    if (this.loginForm.valid) {
      this.globalSer.openLoading();
      this.authService.loginByPassword(this.loginForm.value).subscribe({
        next: () => {
          this.responseHandler.handleSuccess('auth.login-success', () => {
            this.router.navigate(['/manager-file/home']);
          });
        },
        error: (error) => {
          this.responseHandler.handleErrorWithUnverifiedCheck(
            error,
            () => this.loginForm.get('userName')?.value
          );
        },
      });
    }
  }
}
