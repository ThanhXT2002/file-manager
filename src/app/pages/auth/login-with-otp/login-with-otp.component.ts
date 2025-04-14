import { Component } from '@angular/core';
import { GlobalModule } from '../../../core/modules/global.module';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/service/global.service';
import { Router } from '@angular/router';
import { BasicPage } from '../../../core/shares/basic-page';
import { environment } from '../../../../environments/environment';
import { LinkRegisterForgotPasswordComponent } from "../components/link-register-forgot-password/link-register-forgot-password.component";

@Component({
  selector: 'app-login-with-otp',
  imports: [GlobalModule, AuthLibModule,  LinkRegisterForgotPasswordComponent],
  templateUrl: './login-with-otp.component.html',
  styleUrl: './login-with-otp.component.scss',
})
export class LoginWithOtpComponent extends BasicPage {
  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    protected override globalSer: GlobalService,
    private router: Router
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
        userName: 'tranxuanthanhtxt2002@gamil.com',
      });
    }
  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
    });
  }


  onLogin() {
    console.log('Ok');
    // this.beginCallApi('Đang đăng nhập...');
    // this.userApi.loginPassword(this.loginData).subscribe({
    //   error: (err) => {
    //     this.messageBoxSer.error(err);
    //   },
    //   next: (res) => {
    //     switch (res.code) {
    //       case ELoginStatus.OtpSuccess: {
    //         this.userApi.loginCompletely(res.result ?? '');
    //         break;
    //       }
    //       case ELoginStatus.EmailNotFound: {
    //         const dialogRef = this.messageBoxSer.ok({
    //           html: res.message,
    //           buttons: [
    //             MessageBoxButton.CreateOK({ html: 'Đăng ký tài khoản' }),
    //             MessageBoxButton.CreateClose(),
    //           ],
    //         });
    //         dialogRef.afterClosed().subscribe((result) => {
    //           if (result == 'ok') {
    //             this.openLoading();
    //             this.router.navigate(['auths/sign-up-email'], {
    //               queryParams: { email: this.loginData.username },
    //             });
    //           }
    //         });
    //         break;
    //       }
    //       case ELoginStatus.PhoneNotFound: {
    //         const dialogRef = this.messageBoxSer.ok({
    //           html: res.message,
    //           buttons: [
    //             MessageBoxButton.CreateOK({ html: 'Đăng ký tài khoản' }),
    //             MessageBoxButton.CreateClose(),
    //           ],
    //         });
    //         dialogRef.afterClosed().subscribe((result) => {
    //           if (result == 'ok') {
    //             this.openLoading();
    //             this.router.navigate(['auths/sign-up-phone'], {
    //               queryParams: { phone: this.loginData.username },
    //             });
    //           }
    //         });
    //         break;
    //       }
    //       case ELoginStatus.Unconfimred: {
    //         const dialogRef = this.messageBoxSer.ok({
    //           html: res.message,
    //           buttons: [
    //             MessageBoxButton.CreateOK({ html: 'Xác thực tài khoản' }),
    //             MessageBoxButton.CreateClose(),
    //           ],
    //         });
    //         dialogRef.afterClosed().subscribe((result) => {
    //           if (result == 'ok') {
    //             this.verifyAccount();
    //           }
    //         });
    //         break;
    //       }
    //     }
    //   },
    // });
  }

  verifyAccount() {
    // this.beginCallApi();
    // this.userApi.createOtp(this.loginData.username).subscribe({
    //   error: (err) => {
    //     this.messageBoxSer.error(err);
    //   },
    //   next: (res) => {
    //     this.snackSer.success(res);
    //   },
    //   complete: () => {
    //     this.openLoading();
    //     this.router.navigate(['auths/verify-account'], {
    //       queryParams: { username: this.loginData.username },
    //     });
    //   },
    // });
  }


}

