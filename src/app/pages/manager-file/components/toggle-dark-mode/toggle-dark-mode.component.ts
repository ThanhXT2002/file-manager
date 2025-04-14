import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle-dark-mode',
  imports: [CommonModule],
  templateUrl: './toggle-dark-mode.component.html',
  styleUrl: './toggle-dark-mode.component.scss',
})
export class ToggleDarkModeComponent {
  isDarkMode!: boolean;

ngOnInit() {
  // Kiểm tra darkmode khi khởi động
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.querySelector('html')?.classList.add('dark');
    this.isDarkMode = true;
  } else {
    document.querySelector('html')?.classList.remove('dark');
    this.isDarkMode = false;
  }
}



  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode; // Cập nhật trạng thái dark mode
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('dark');

    // Nếu muốn lưu trạng thái người dùng đã chọn
    const isDarkMode = element.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  }
}
