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
import { catchError, filter, of, switchMap, take, timeout } from 'rxjs';


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

      this.loginForm.patchValue({
        userName: 'tranxuanthanhtxt2002@gmail.com',
        password: 'Thanh2002@',
      });

  }

  createForm() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onLoginByPassword() {
  if (this.loginForm.valid) {
    this.globalSer.openLoading();

    this.authService.loginByPassword(this.loginForm.value)
      .pipe(
        // Chuyển sang theo dõi API fetchFullUserInfo
        // (đã được gọi tự động trong loginByPassword)
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
              console.warn('Could not get full user info, continuing with basic info:', err);
              return of(null);
            })
          );
        })
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
            () => this.loginForm.get('userName')?.value
          );
        },
        complete: () => {
          // Đảm bảo đóng loading trong mọi trường hợp
          this.globalSer.closeLoading();
        }
      });
  }
}
}
