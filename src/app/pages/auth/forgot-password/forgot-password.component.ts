import { Component } from '@angular/core';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';
import { GlobalModule } from '../../../core/modules/global.module';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { GlobalService } from '../../../core/service/global.service';
import { Router } from '@angular/router';
import { BasicPage } from '../../../core/shares/basic-page';
import { base64Helper } from '../../../core/helpers/util';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [GlobalModule, AuthLibModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent extends BasicPage {
  forgotForm: FormGroup;

  constructor(
    protected override globalSer: GlobalService,
    private fb: FormBuilder,
    private router: Router
  ) {
    super(globalSer);
    this.forgotForm = this.fb.group({
      userName: ['', Validators.required],
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  onGetOtp() {
    if (this.forgotForm.get('userName')?.valid) {
      // this.authService;
      // .forgotPassword(this.forgotForm.value.userName)
      // .subscribe({
      //   next: (res) => {
      //     if (res.statusCode == 200) {
      //       this.toastr.success('Gửi mã xác thực thành công!');
      //       this.isTabVerify = true;
      //     } else {
      //       this.toastr.error(res.message);
      //     }
      //   },
      //   error: (err) => {
      //     this.toastr.error(err.error.message);
      //   },
      // });
    } else {
      // this.toastr.error('Vui lòng nhập email hoặc số điện thoại!');
    }
  }

  onVerifyOtp() {
    if (this.forgotForm.valid) {
      this.beginCallApi();
      // Tạo một đối tượng chứa thông tin cần chuyển
      const data = {
        userName: this.forgotForm.get('userName')?.value,
        otp: this.forgotForm.get('otp')?.value,
      };

      // Mã hóa đối tượng thành chuỗi base64
      const encodedData = base64Helper.objectToBase64(data);
      this.router.navigate(['/auth/reset-password'], {
        queryParams: {
          data: encodedData
        },
      });
    }
    // this.beginCallApi('Đang xác thực mã OTP...');
    // this.userApi.verifyOtp(this.otpCode).subscribe({
    //   error: (err) => {
    //     this.messageBoxSer.error(err);
    //   },
    //   next: (res) => {
    //     if (res.code == ELoginStatus.OtpSuccess) {
    //       this.snackSer.success(res);
    //       this.router.navigate(['auth/reset-password'], {
    //         queryParams: { data: base64Helper.objectToBase64(this.otpCode) },
    //       });
    //     } else {
    //       this.snackSer.error(res);
    //     }
    //   },
    //   complete: () => {
    //     this.closeLoadIndicator();
    //   },
    // });
  }

  sendOtp() {

  }

  goBack() {
    window.history.go(-1);
  }
}



