import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../interfaces/user.interface';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  // Kiểm tra trạng thái xác thực khi ứng dụng khởi động
  checkAuthStatus$(): Observable<any> {
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
        }),
        catchError((err) => {
          this.currentUserSubject.next(null);
          this.stopRefreshTokenTimer();
          return throwError(() => err);
        })
      );
  }

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
            this.checkAuthStatus();
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
    return this.http
      .get<any>(`${this.apiUrl}/refresh`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            this.startRefreshTokenTimer();
            this.checkAuthStatus();
          }
        }),
        catchError((error) => {
          console.error('Refresh token error:', error);
          return throwError(() => error);
        })
      );
  }

  // Thêm timer để tự động refresh token
  private startRefreshTokenTimer() {
    // Refresh 5 phút trước khi hết hạn
    const refreshTimeInMs = 55 * 60 * 1000;

    // Clear any existing timer
    this.stopRefreshTokenTimer();

    // Set new timer
    this.refreshTokenTimeout = setTimeout(() => {
      console.log('Automatically refreshing token...');
      this.refreshToken().subscribe();
    }, refreshTimeInMs);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  // Đăng xuất
  logout(): Observable<any> {
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

  // Kiểm tra trạng thái xác thực khi ứng dụng khởi động
  checkAuthStatus(): void {
    this.http
      .get<any>(`${this.apiUrl}/me`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            this.startRefreshTokenTimer();
          }
        },
        error: () => {
          this.currentUserSubject.next(null);
          this.stopRefreshTokenTimer();
        },
      });
  }

  // Đăng ký
  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  // Xác minh OTP
  verifyOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, data);
  }

  // Gửi lại OTP
  resendOtp(email: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/resend-otp`,
      JSON.stringify(email),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Helper methods
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
