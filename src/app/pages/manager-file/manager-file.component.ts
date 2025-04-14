import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { GlobalService } from '../../core/service/global.server';
import { CustomToastService } from '../../core/service/custom-toast.service';
import { TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-manager-file',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './manager-file.component.html',
  styleUrl: './manager-file.component.scss',
})
export class ManagerFileComponent {
  user: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService,
    private toastServie: CustomToastService,
    private translateService: TranslateService
  ) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('user', user);
    });
  }

  ngOnInit() {
    // this.logout();
  }

  logout() {
    this.globalService.openLoading();
    this.authService.logout().subscribe({
      next: () => {
        this.toastServie.showToast('success', {
          detail: this.translateService.instant('profile.logout-success'),
          sticky: false,
          life: 5000,
        });

        this.globalService.closeLoading();
      },
      error: () => {
        this.toastServie.showToast('error', {
          detail: this.translateService.instant('profile.logout-success'),
          sticky: false,
          life: 5000,
        });
        this.globalService.closeLoading();
      },
    });
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('dark');

    // Nếu muốn lưu trạng thái người dùng đã chọn
    const isDarkMode = element.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  }
}
