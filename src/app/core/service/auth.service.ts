import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.server';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private globalSer: GlobalService,
    private router: Router
  ) {
    // this.checkAuthStatus();
  }

  // Đăng nhập
  loginByPassword(credentials: { userName: string; password: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true, // Quan trọng: cho phép gửi/nhận cookies
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            this.currentUserSubject.next(response.data);
            // this.checkAuthStatus();
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
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
          this.currentUserSubject.next(null);
          this.router.navigate(['/auth/login']);
        }),
        catchError((error) => {
          console.error('Logout error:', error);
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
          }
        },
        error: () => {
          this.currentUserSubject.next(null);
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

  get currentUser(): any {
    return this.currentUserSubject.value;
  }
}
