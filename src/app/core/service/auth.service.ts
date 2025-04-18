import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import {
  IResetPassword,
  IUpdateProfile,
  User,
} from '../interfaces/user.interface';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  public currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshTokenTimeout: any;
  private authCheckInProgress = false;

  constructor(private http: HttpClient) {}

  /**
   * login by otp
   **/

  loginByOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/verify-login-otp`, data, {
        withCredentials: true, // Quan trọng: cho phép gửi/nhận cookies
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            this.startRefreshTokenTimer(); // Bắt đầu timer sau khi đăng nhập
            this.checkAuthStatus().subscribe(); // Kiểm tra trạng thái xác thực ngay sau khi đăng nhập
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  getOtpLogin(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-login-otp`, {
      email: email,
    });
  }

  resendOptLogin(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/resend-login-otp`,
      JSON.stringify(email),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  /**
   * end login by otp
   **/

  // Đăng nhập
  loginByPassword(credentials: {
    userName: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true, // Quan trọng: cho phép gửi/nhận cookies
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            this.startRefreshTokenTimer(); // Bắt đầu timer sau khi đăng nhập
            this.checkAuthStatus().subscribe(); // Kiểm tra trạng thái xác thực ngay sau khi đăng nhập
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // Thêm method refreshToken
  refreshToken(): Observable<any> {
    if (!this.isLoggedIn) {
      return of({ success: false });
    }

    return this.http
      .get<any>(`${this.apiUrl}/refresh`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            this.startRefreshTokenTimer();
          }
        }),
        catchError((error) => {
          console.error('Refresh token error:', error);

          this.currentUserSubject.next(null);
          this.stopRefreshTokenTimer();
          return throwError(() => error);
        })
      );
  }

  // Thêm timer để tự động refresh token
  private startRefreshTokenTimer() {
    // Refresh 5 phút trước khi hết hạn
    const refreshTimeInMs = 55 * 60 * 1000;
    this.stopRefreshTokenTimer();

    // Set new timer
    this.refreshTokenTimeout = setTimeout(() => {
      console.log('Automatically refreshing token...');
      this.refreshToken().subscribe();
    }, refreshTimeInMs);
  }

  public stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  // Đăng xuất
  logout(): Observable<any> {
    // Nếu người dùng chưa đăng nhập, không cần gọi API đăng xuất
    if (!this.isLoggedIn) {
      this.stopRefreshTokenTimer();
      this.currentUserSubject.next(null);
      return of({ success: true });
    }

    return this.http
      .post<any>(
        `${this.apiUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.stopRefreshTokenTimer(); // Dừng timer khi đăng xuất
          this.currentUserSubject.next(null);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  // Kiểm tra trạng thái xác thực
  checkAuthStatus(): Observable<any> {
    // Tránh gọi API nhiều lần cùng lúc
    if (this.authCheckInProgress) {
      return this.currentUser$;
    }

    this.authCheckInProgress = true;

    return this.http
      .get<any>(`${this.apiUrl}/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            this.startRefreshTokenTimer();
          }
          this.authCheckInProgress = false;
        }),
        catchError((error) => {
          this.currentUserSubject.next(null);
          this.stopRefreshTokenTimer();
          this.authCheckInProgress = false;
          // Không throw error khi auth check thất bại, chỉ đánh dấu không đăng nhập
          return of(null);
        })
      );
  }

  // Đăng ký
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  // Xác minh OTP
  verifyRegisterOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-register-otp`, data);
  }

  // Gửi lại OTP
  resendRegisterOtp(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/resend-register-otp`,
      JSON.stringify(email),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  /**
   * quên mật khẩu
   **/
  getOtpFogotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-password-reset`, {
      email: email,
    });
  }

  resetPassword(data: IResetPassword): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data);
  }

  resendOptFogotPassword(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/resend-password-reset-otp`,
      JSON.stringify(email),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  /**
   * kết thúc quên mật khẩu
   **/

  /**
   * cập nhật thông tin cá nhân
   **/

  // Interface for profile update

  updateProfile(data: IUpdateProfile): Observable<ApiResponse<User>> {
    const formData = new FormData();

    if (data.fullName) formData.append('fullName', data.fullName);
    if (data.address) formData.append('address', data.address);
    if (data.avatar) formData.append('avatar', data.avatar);

    return this.http
      .put<ApiResponse<User>>(`${this.apiUrl}/update-profile`, formData, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          // Nếu cập nhật thành công, cập nhật lại thông tin người dùng hiện tại
          if (response && response.success && response.data) {
            this.currentUserSubject.next(response.data);
          }
        })
      );
  }

  /**
   * cập nhật thông tin cá nhân
   **/

  // Helper methods
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
