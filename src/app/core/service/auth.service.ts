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

  // Storage key cho người dùng
  private readonly USER_STORAGE_KEY = 'file_manager_current_user';

  constructor(private http: HttpClient) {
    // Khôi phục trạng thái người dùng khi khởi động
    this.loadUserFromStorage();
  }

  /**
   * Lưu thông tin người dùng vào localStorage
   */
  private saveUserToStorage(user: User | null): void {
    if (user) {
      try {
        // Kiểm tra đầy đủ thông tin trước khi lưu
        const requiredProps = ['id', 'fullName', 'email', 'phone', 'address', 'avatar', 'role'];
        const missingProps = requiredProps.filter(prop => !(prop in user));

        if (missingProps.length > 0) {
          console.warn('Warning: User info missing properties:', missingProps);
          // Có thể bổ sung thông tin từ lần lưu trước nếu cần
          const existingUserStr = localStorage.getItem(this.USER_STORAGE_KEY);
          if (existingUserStr) {
            const existingUser = JSON.parse(existingUserStr);
            // Kết hợp dữ liệu để đầy đủ nhất có thể
            const mergedUser = { ...existingUser, ...user };
            localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(mergedUser));
            return;
          }
        }

        // Lưu thông tin đầy đủ
        localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(user));
        console.log('Saved full user info to storage:', user);
      } catch (error) {
        console.error('Error saving user to storage:', error);
      }
    } else {
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }

  /**
   * Đọc thông tin người dùng từ localStorage
   */
  private loadUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        const user = JSON.parse(storedUser) as User;
        console.log('User info loaded from storage:', user);
        this.currentUserSubject.next(user);
        // Bắt đầu timer refresh token nếu có thông tin người dùng
        this.startRefreshTokenTimer();
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      localStorage.removeItem(this.USER_STORAGE_KEY);
    }
  }

  /**
   * Lấy thông tin người dùng từ localStorage
   */
  getUserFromStorage(): User | null {
    try {
      const storedUser = localStorage.getItem(this.USER_STORAGE_KEY);
      if (storedUser) {
        return JSON.parse(storedUser) as User;
      }
    } catch (error) {
      console.error('Error getting user from storage:', error);
    }
    return null;
  }

  /**
   * Đăng nhập bằng OTP
   */
  loginByOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/verify-login-otp`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            console.log('OTP login successful, basic user info:', response.data);
            // KHÔNG lưu thông tin người dùng ở đây, chỉ lấy thông tin đăng nhập cơ bản

            // Gọi tiếp API me để lấy thông tin đầy đủ
            this.fetchFullUserInfo().subscribe();
          }
        }),
        catchError((error) => {
          console.error('Login OTP error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Lấy thông tin người dùng đầy đủ từ API /auth/me
   */
  fetchFullUserInfo(): Observable<User | null> {
    console.log('Fetching full user info from /auth/me API...');

    return this.http
      .get<any>(`${this.apiUrl}/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.success && response.data) {
            console.log('Full user info received:', response.data);

            // Cập nhật thông tin người dùng từ API
            this.currentUserSubject.next(response.data);

            // Lưu thông tin người dùng vào localStorage
            this.saveUserToStorage(response.data);

            // Bắt đầu timer refresh token
            this.startRefreshTokenTimer();
          }
        }),
        catchError((error) => {
          console.error('Error fetching user info:', error);
          return of(null);
        })
      );
  }

  /**
   * Yêu cầu OTP để đăng nhập
   */
  getOtpLogin(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-login-otp`, {
      email: email,
    });
  }

  /**
   * Gửi lại OTP đăng nhập
   */
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
   * Đăng nhập bằng mật khẩu
   */
  loginByPassword(credentials: {
    userName: string;
    password: string;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          if (response && response.success) {
            console.log('Login successful, basic user info:', response.data);
            // KHÔNG lưu thông tin người dùng ở đây, chỉ lấy thông tin đăng nhập cơ bản

            // Gọi API /auth/me ngay sau khi đăng nhập để lấy thông tin đầy đủ
            this.fetchFullUserInfo().subscribe();
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh token
   */
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
          if (response && response.success && response.data) {
            // Cập nhật thông tin người dùng
            const currentUser = this.currentUserSubject.value;
            // Kết hợp thông tin mới với thông tin hiện có để đảm bảo đầy đủ
            const updatedUser = { ...currentUser, ...response.data };

            this.currentUserSubject.next(updatedUser);
            this.saveUserToStorage(updatedUser);
            this.startRefreshTokenTimer();
          }
        }),
        catchError((error) => {
          console.error('Refresh token error:', error);

          // Nếu là lỗi kết nối, không thay đổi trạng thái người dùng
          if (error.status === 0) {
            return throwError(() => error);
          }

          // Nếu là lỗi 401/403, xóa thông tin người dùng
          if (error.status === 401 || error.status === 403) {
            this.currentUserSubject.next(null);
            this.saveUserToStorage(null);
            this.stopRefreshTokenTimer();
          }

          return throwError(() => error);
        })
      );
  }

  /**
   * Thiết lập timer để tự động refresh token
   */
  private startRefreshTokenTimer() {
    // Refresh token trước khi hết hạn (55 phút)
    const refreshTimeInMs = 55 * 60 * 1000;
    this.stopRefreshTokenTimer();

    this.refreshTokenTimeout = setTimeout(() => {
      console.log('Automatically refreshing token...');
      this.refreshToken().subscribe();
    }, refreshTimeInMs);
  }

  /**
   * Dừng timer refresh token
   */
  public stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
      this.refreshTokenTimeout = null;
    }
  }

  /**
   * Đăng xuất
   */
  logout(): Observable<any> {
    // Nếu người dùng chưa đăng nhập, không cần gọi API
    if (!this.isLoggedIn) {
      this.currentUserSubject.next(null);
      this.saveUserToStorage(null);
      this.stopRefreshTokenTimer();
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
          // Xóa thông tin người dùng
          this.currentUserSubject.next(null);
          this.saveUserToStorage(null);
          this.stopRefreshTokenTimer();
        }),
        catchError((error) => {
          // Ngay cả khi có lỗi, vẫn xóa thông tin người dùng
          this.currentUserSubject.next(null);
          this.saveUserToStorage(null);
          this.stopRefreshTokenTimer();
          return throwError(() => error);
        })
      );
  }

  /**
   * Kiểm tra trạng thái xác thực - CHỈ đọc từ localStorage
   * KHÔNG gọi API /auth/me khi refresh trang
   */
  checkAuthStatus(): Observable<User | null> {
    // Đọc thông tin người dùng từ localStorage
    const storedUser = this.getUserFromStorage();

    if (storedUser) {
      // Nếu có thông tin người dùng trong localStorage, cập nhật BehaviorSubject
      this.currentUserSubject.next(storedUser);

      // Bắt đầu timer refresh token
      this.startRefreshTokenTimer();

      return of(storedUser);
    }

    // Nếu không có thông tin người dùng, trả về null
    return of(null);
  }

  /**
   * Đăng ký tài khoản
   */
  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data);
  }

  /**
   * Xác minh OTP đăng ký
   */
  verifyRegisterOtp(data: { email: string; otp: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/verify-register-otp`, data);
  }

  /**
   * Gửi lại OTP đăng ký
   */
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
   * Cập nhật thông tin cá nhân
   */
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
          if (response && response.success && response.data) {
            // Kết hợp thông tin mới với thông tin cũ
            const currentUser = this.currentUserSubject.value;
            const updatedUser = { ...currentUser, ...response.data };

            this.currentUserSubject.next(updatedUser);
            this.saveUserToStorage(updatedUser);
          }
        })
      );
  }

  /**
   * Kiểm tra người dùng đã đăng nhập hay chưa
   */
  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Buộc cập nhật thông tin người dùng (sử dụng khi cần thiết)
   * Gọi API /auth/me để cập nhật thông tin mới nhất
   */
  forceUpdateUserInfo(): Observable<User | null> {
    return this.fetchFullUserInfo();
  }
}
