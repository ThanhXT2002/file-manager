// response-handler.service.ts
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GlobalService } from './global.service';
import { CustomToastService } from './custom-toast.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResponseHandlerService {
  constructor(
    private globalService: GlobalService,
    private toastService: CustomToastService,
    private translateService: TranslateService,
    private router: Router
  ) {}

  /**
   * Xử lý lỗi từ HTTP response
   */
  handleError(error: any, prefix: string = 'auth', callback?: () => void) {
    const errorCode = error?.error?.errorCode || 'UNKNOWN_ERROR';

    if (!environment.production) {
      console.log('Error code:', errorCode);
    }

    // Kiểm tra nếu là lỗi tài khoản chưa xác minh
    if (errorCode === 'UNVERIFIED-ACCOUNT') {
      return false; // Không xử lý mặc định
    }

    let errorMessage = this.translateService.instant(
      `${prefix}.${errorCode.toLowerCase()}`
    );

    this.toastService.showToast('error', {
      detail: errorMessage,
      sticky: false,
      life: 5000,
    });

    this.globalService.closeLoading();

    if (callback) {
      callback();
    }

    return true; // Đã xử lý lỗi
  }

  /**
   * Xử lý lỗi tài khoản chưa xác minh và đưa ra hành động đi đến trang xác minh
   * @param error Lỗi từ API
   * @param emailFieldGetter Hàm trả về giá trị email từ form
   * @returns True nếu đã xử lý lỗi UNVERIFIED-ACCOUNT, false nếu không phải
   */
  handleErrorUnverifiedAccount(
    error: any,
    emailFieldGetter: () => string | null | undefined
  ): boolean {
    const errorCode = error?.error?.errorCode;

    if (errorCode !== 'UNVERIFIED-ACCOUNT') {
      return false; // Không phải lỗi này, trả về false để xử lý tiếp
    }

    if (!environment.production) {
      console.log('Error code:', errorCode);
    }

    const errorMessage = this.translateService.instant(
      `auth.${errorCode.toLowerCase()}`
    );

    this.toastService.showToast('error', {
      detail: errorMessage,
      action: {
        label: this.translateService.instant('auth.verify-now'),
        callback: () => {
          const email = emailFieldGetter();
          if (email) {
            this.router.navigate(['/auth/verify-account'], {
              queryParams: { email },
            });
          }
        },
      },
    });

    this.globalService.closeLoading();
    return true; // Đã xử lý lỗi
  }

  /**
   * Xử lý thành công từ HTTP response
   */
  handleSuccess(message: string, callback?: () => void) {
    this.globalService.closeLoading();
    this.toastService.showToast('success', {
      detail: this.translateService.instant(message),
      sticky: false,
      life: 5000,
    });

    if (callback) {
      callback();
    }
  }

  handleErrorWithUnverifiedCheck(
    error: any,
    emailFieldGetter: () => string | null | undefined,
    prefix: string = 'auth',
    callback?: () => void
  ): void {
    // Thử xử lý lỗi tài khoản chưa xác minh trước
    const handled = this.handleErrorUnverifiedAccount(error, emailFieldGetter);

    // Nếu không phải lỗi tài khoản chưa xác minh, xử lý lỗi thông thường
    if (!handled) {
      this.handleError(error, prefix, callback);
    }
  }
}
