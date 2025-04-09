import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manager-file',
  imports: [
    RouterOutlet
  ],
  templateUrl: './manager-file.component.html',
  styleUrl: './manager-file.component.scss',
})
export class ManagerFileComponent {
  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('dark');

    // Nếu muốn lưu trạng thái người dùng đã chọn
    const isDarkMode = element.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  }
}
