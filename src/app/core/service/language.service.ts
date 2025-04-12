import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLanguageSubject: BehaviorSubject<string>;
  public currentLanguage$: Observable<string>;

  // Danh sách ngôn ngữ hỗ trợ
  public languages: Language[] = [
    { code: 'en', name: 'English', flag: 'images/flags/en.png' },
    { code: 'cn', name: '中文', flag: 'images/flags/cn.png' },
    { code: 'vi', name: 'Tiếng Việt', flag: 'images/flags/vn.png' },
  ];

  constructor(private translateService: TranslateService) {
    // Lấy ngôn ngữ đã lưu hoặc sử dụng mặc định
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'vi';

    this.currentLanguageSubject = new BehaviorSubject<string>(savedLanguage);
    this.currentLanguage$ = this.currentLanguageSubject.asObservable();

    // Khởi tạo ngx-translate
    this.initTranslateService();
  }

  private initTranslateService(): void {
    // Thiết lập ngôn ngữ mặc định
    this.translateService.setDefaultLang('vi');

    // Thiết lập ngôn ngữ hiện tại
    const currentLang = this.currentLanguageSubject.getValue();
    this.translateService.use(currentLang);
  }

  // Phương thức chuyển đổi ngôn ngữ
  changeLanguage(langCode: string): void {
    if (this.isValidLanguage(langCode)) {
      this.translateService.use(langCode);
      localStorage.setItem('selectedLanguage', langCode);
      this.currentLanguageSubject.next(langCode);
    }
  }

  // Kiểm tra xem mã ngôn ngữ có hợp lệ không
  private isValidLanguage(langCode: string): boolean {
    return this.languages.some((lang) => lang.code === langCode);
  }

  // Lấy ngôn ngữ hiện tại
  getCurrentLanguage(): string {
    return this.currentLanguageSubject.getValue();
  }

  // Lấy thông tin đầy đủ của ngôn ngữ hiện tại
  getCurrentLanguageInfo(): Language {
    const currentLangCode = this.getCurrentLanguage();
    return (
      this.languages.find((lang) => lang.code === currentLangCode) ||
      this.languages[0]
    );
  }
}
