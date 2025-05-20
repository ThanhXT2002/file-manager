import { Breadcrumb, BreadcrumbModule } from 'primeng/breadcrumb';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MenuSiderComponent } from "./components/menu-sider/menu-sider.component";
import { Observable, Subscription } from 'rxjs';
import { MenuSiderService } from '../../core/service/menu-sider.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { BreadcrumbService } from '../../core/service/breadcrumb.service';

@Component({
  selector: 'app-manager-file',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MenuSiderComponent, CommonModule,Breadcrumb, BreadcrumbModule],
  templateUrl: './manager-file.component.html',
  styleUrl: './manager-file.component.scss',
})
export class ManagerFileComponent {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/manager-file' };

  isMenuVisible$: Observable<boolean>;
  private subscription: Subscription | null = null;

  constructor(
    private menuSiderService: MenuSiderService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.isMenuVisible$ = this.menuSiderService.isVisible$;
  }

  ngOnInit() {
    // Đăng ký lắng nghe thay đổi từ service
    this.subscription = this.breadcrumbService.breadcrumbs$.subscribe(
      breadcrumbs => {
        this.items = breadcrumbs;
      }
    );
  }

  ngOnDestroy() {
    // Hủy đăng ký lắng nghe khi component bị hủy
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

}
