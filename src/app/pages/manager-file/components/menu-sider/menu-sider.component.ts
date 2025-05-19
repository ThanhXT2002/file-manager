import { AuthService } from './../../../../core/service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../core/interfaces/menu-item.interface';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuSiderService } from '../../../../core/service/menu-sider.service';
import { GlobalService } from '../../../../core/service/global.service';
import { CustomToastService } from '../../../../core/service/custom-toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-sider',
  imports: [Ripple, CommonModule, RouterModule],
  templateUrl: './menu-sider.component.html',
  styleUrl: './menu-sider.component.scss',
})
export class MenuSiderComponent implements OnInit {
  expandedItems = new Set<string>();
  menuItems: MenuItem[] = [];
  isMenuVisible$: Observable<boolean>;

  constructor(
    private router: Router,
    private menuSiderService: MenuSiderService,
    private authService: AuthService,
    private globalService: GlobalService,
    private toastService: CustomToastService,
    private translateService: TranslateService,
  ) {
    this.isMenuVisible$ = this.menuSiderService.isVisible$;
  }

  ngOnInit(): void {
    this.initMenuItems();
  }

  private initMenuItems(): void {
    this.menuItems = [
      {
        label: 'New',
        icon: 'pi pi-plus',
        children: [
          {
            label: 'Upload File',
            icon: 'pi pi-file-arrow-up',
            action: () => this.handleExpenses(),
          },
          {
            label: 'New Folder',
            icon: 'pi pi-folder-plus',
            action: () => this.handleExpenses(),
          },
          {
            label: 'Upload Folder',
            icon: 'pi pi-folder-open',
            action: () => this.handleExpenses(),
          },
        ],
      },
      {
        label: 'My Files',
        icon: 'pi pi-file',
        route: '/manager-file/my-files',
        action: () => this.handleDashboard(),
      },
      {
        label: 'Starred',
        icon: 'pi pi-star',
        route: '/starred',
        action: () => this.handleBookmarks(),
      },
      {
        label: 'Recent',
        icon: 'pi pi-clock',
        route: '/manager-file/recent',
        action: () => this.handleTeam(),
      },
      {
        label: 'Shared with me',
        icon: 'pi pi-share-alt',
        route: '/manager-file/shared-with-me',
        action: () => this.handleTeam(),
      },
      {
        label: 'Trash',
        icon: 'pi pi-trash',
        route: '/manager-file/trash',
        action: () => this.handleTeam(),
      },
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        badge: '3',
        action: () => this.handleMessages(),
      },
      {
        label: 'Projects',
        icon: 'pi pi-folder',
        action: () => this.handleCalendar(),
      },
      {
        label: 'documents',
        icon: 'pi pi-folder',
        action: () => this.handleCalendar(),
      },
      {
        label: 'Iamges',
        icon: 'pi pi-folder',
        action: () => this.handleCalendar(),
      },
      {
        label: 'Downloads',
        icon: 'pi pi-folder',
        action: () => this.handleCalendar(),
      },
      {
        label: 'Uploads Files',
        icon: 'pi pi-file-arrow-up',
        action: () => this.handleCalendar(),
      },
      {
        label: 'New Folder',
        icon: 'pi pi-folder-plus',
        action: () => this.handleCalendar(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        action: () => this.handleSettings(),
      },

      // {
      //   label: 'Dashboard',
      //   icon: 'pi pi-microsoft',
      //   children: [
      //     {
      //       label: 'Revenue',
      //       icon: 'pi pi-chart-line',
      //       children: [
      //         {
      //           label: 'View',
      //           icon: 'pi pi-table',
      //           action: () => this.handleRevenueView(),
      //         },
      //         {
      //           label: 'Search',
      //           icon: 'pi pi-search',
      //           action: () => this.handleRevenueSearch(),
      //         },
      //       ],
      //     },
      //     {
      //       label: 'Expenses',
      //       icon: 'pi pi-chart-line',
      //       action: () => this.handleExpenses(),
      //     },
      //   ],
      // },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        action: () => this.logout(),
      },
    ];
  }

  toggleSubmenu(item: MenuItem): void {
    const itemKey = item.label;

    if (this.expandedItems.has(itemKey)) {
      this.expandedItems.delete(itemKey);
    } else {
      this.expandedItems.add(itemKey);
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.label);
  }

  handleItemClick(item: MenuItem): void {
    if (item.children) {
      this.toggleSubmenu(item);
    }

    if (item.action) {
      item.action();
    }
  }

  // Các phương thức xử lý action riêng biệt
  private handleDashboard(): void {
    console.log('Navigating to Dashboard');
    // Thêm code xử lý Dashboard ở đây
  }

  private handleBookmarks(): void {
    console.log('Handling Bookmarks');
    // Thêm code xử lý Bookmarks ở đây
  }

  private handleRevenueView(): void {
    console.log('Viewing Revenue Reports');
    // Thêm code xử lý Revenue View ở đây
  }

  private handleRevenueSearch(): void {
    console.log('Searching Revenue Reports');
    // Thêm code xử lý Revenue Search ở đây
  }

  private handleExpenses(): void {
    console.log('Handling Expenses');
    // Thêm code xử lý Expenses ở đây
  }

  private handleTeam(): void {
    console.log('Handling Team');
    // Thêm code xử lý Team ở đây
  }

  private handleMessages(): void {
    console.log('Handling Messages');
    // Thêm code xử lý Messages ở đây
  }

  private handleCalendar(): void {
    console.log('Handling Calendar');
    // Thêm code xử lý Calendar ở đây
  }

  private handleSettings(): void {
    console.log('Opening Settings');
    // Thêm code xử lý Settings ở đây
  }

  isActive(item: MenuItem): boolean {
    // Kiểm tra nếu route hiện tại khớp với route của item
    return this.router.url === item.route;
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
