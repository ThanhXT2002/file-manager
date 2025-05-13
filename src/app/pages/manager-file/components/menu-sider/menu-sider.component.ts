import { Component, OnInit } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../core/interfaces/menu-item.interface';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuSiderService } from '../../../../core/service/menu-sider.service';

@Component({
  selector: 'app-menu-sider',
  imports: [Ripple, CommonModule],
  templateUrl: './menu-sider.component.html',
  styleUrl: './menu-sider.component.scss',
})
export class MenuSiderComponent implements OnInit {
  expandedItems = new Set<string>();
  menuItems: MenuItem[] = [];
  isMenuVisible$: Observable<boolean>;

  constructor(
    private router: Router,
    private menuSiderService: MenuSiderService
  ) {
    this.isMenuVisible$ = this.menuSiderService.isVisible$;
  }

  ngOnInit(): void {
    this.initMenuItems();
  }

  private initMenuItems(): void {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '/dashboard',
        action: () => this.handleDashboard(),
      },
      {
        label: 'Bookmarks',
        icon: 'pi pi-bookmark',
        action: () => this.handleBookmarks(),
      },
      {
        label: 'Reports',
        icon: 'pi pi-chart-line',
        children: [
          {
            label: 'Revenue',
            icon: 'pi pi-chart-line',
            children: [
              {
                label: 'View',
                icon: 'pi pi-table',
                action: () => this.handleRevenueView(),
              },
              {
                label: 'Search',
                icon: 'pi pi-search',
                action: () => this.handleRevenueSearch(),
              },
            ],
          },
          {
            label: 'Expenses',
            icon: 'pi pi-chart-line',
            action: () => this.handleExpenses(),
          },
        ],
      },
      {
        label: 'Team',
        icon: 'pi pi-users',
        action: () => this.handleTeam(),
      },
      {
        label: 'Messages',
        icon: 'pi pi-comments',
        badge: '3',
        action: () => this.handleMessages(),
      },
      {
        label: 'Calendar',
        icon: 'pi pi-calendar',
        action: () => this.handleCalendar(),
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        action: () => this.handleSettings(),
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
}
