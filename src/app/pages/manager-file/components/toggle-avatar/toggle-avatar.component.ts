import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../../core/service/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GlobalService } from '../../../../core/service/global.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../../../../core/interfaces/user.interface';
import { TranslateService } from '@ngx-translate/core';
import { CustomToastService } from '../../../../core/service/custom-toast.service';

class ItemMenu {
  title: string = '';
  iconFont: string = '';
  click: any;

  constructor(props: any = {}) {
    this.title = props.title || '';
    this.iconFont = props.iconFont || `<i class="fa-solid fa-user"></i>`;
    this.click =
      props.click ||
      function () {
        console.log('noavailable');
      };
  }
}

@Component({
  selector: 'app-toggle-avatar',
  imports: [AvatarModule, CommonModule, ButtonModule],
  templateUrl: './toggle-avatar.component.html',
  styleUrl: './toggle-avatar.component.scss',
})
export class ToggleAvatarComponent implements OnInit {
  menus: Array<ItemMenu> = [];
  private subscription!: Subscription;
  user: User | null = null;

  constructor(
    protected authService: AuthService,
    private globalService: GlobalService,
    private router: Router,
    private toastService: CustomToastService,
    private translateService: TranslateService
  ) {}

  lstItemMenus = {
    dashboard: new ItemMenu({
      title: 'Dashboard',
      iconFont: `<i class="fa-solid fa-gauge"></i>`,
      click: () => {
        this.router.navigate(['admin/dashboard']);
      },
    }),
    setting: new ItemMenu({
      title: 'Cài đặt',
      iconFont: `<i class="fa fa-cog"></i>`,
      click: () => {
        this.router.navigate(['/manager-file/setting']);
      },
    }),
    logout: new ItemMenu({
      title: 'Đăng xuất',
      iconFont: `<i class="fa-solid fa-right-from-bracket"></i>`,
      click: () => {
        this.logout();
      },
    }),
  };

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.reBuildMenu();
    });
  }

  reBuildMenu() {
    console.log('rebuild menu');
    this.menus = [];
    console.log('rebuild menu2');
    const { lstItemMenus } = this;
    console.log('user', this.user);
    if (this.user?.role == 1) {
      this.menus.push(lstItemMenus.dashboard);
    }
    this.menus.push(...[lstItemMenus.setting, lstItemMenus.logout]);
    console.log('rebuild menu3', this.menus);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.globalService.openLoading();
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.showToast('success', {
          detail: this.translateService.instant('profile.logout-success'),
          sticky: true,
          life: 5000,
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toastService.showToast('error', {
          detail: this.translateService.instant('profile.logout-failed'),
          sticky: true,
          life: 5000,
        });
      },
    });
  }
}
