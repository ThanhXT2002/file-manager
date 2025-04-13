import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../service/language.service';
import { SpeedDial } from 'primeng/speeddial';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-auth-speed-dial',
  imports: [SpeedDial, CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './auth-speed-dial.component.html',
  styleUrl: './auth-speed-dial.component.scss',
})
export class AuthSpeedDialComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  currentLanguage!: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private languageService: LanguageService,
  ) {}

  ngOnInit() {
     this.configureItems();

    // Kiểm tra darkmode khi khởi động
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
      document.querySelector('html')?.classList.add('dark');
    } else {
      document.querySelector('html')?.classList.remove('dark');
    }

    // Cập nhật icon
    this.updateDarkModeIcon();
  }

  configureItems() {
    // Tạo items cho các ngôn ngữ
    const languageItems = this.languageService.languages.map((lang) => {
      return {
        label: lang.code,
        command: () => {
          this.changeLanguage(lang.code);
        },
      };
    });

    // Thêm nút chuyển đổi darkmode
    const darkModeItem = {
      label : 'Theme',
      icon: 'pi pi-moon', // Hoặc 'pi pi-sun' tùy thuộc vào trạng thái hiện tại
      command: () => {
        this.toggleDarkMode();

        // Cập nhật lại icon cho nút darkmode sau khi chuyển đổi
        this.updateDarkModeIcon();
      },
    };

    // Kết hợp cả hai loại items
    this.items = [...languageItems, darkModeItem];
  }

  changeLanguage(langCode: string) {
    this.languageService.changeLanguage(langCode);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('dark');

    // Nếu muốn lưu trạng thái người dùng đã chọn
    const isDarkMode = element.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  }

  updateDarkModeIcon() {
    const isDarkMode = document
      .querySelector('html')
      ?.classList.contains('dark');

    // Tìm và cập nhật icon của item darkmode
    const darkModeItemIndex = this.items.findIndex(
      (item) => item.label === 'Theme'
    );
    if (darkModeItemIndex !== -1) {
      this.items[darkModeItemIndex].icon = isDarkMode
        ? 'pi pi-sun'
        : 'pi pi-moon';
    }
  }

  ngOnDestroy() {
    // Hủy subscription khi component bị hủy
    this.subscription.unsubscribe();
  }
}
