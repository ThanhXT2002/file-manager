import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MenuSiderComponent } from "./components/menu-sider/menu-sider.component";
import { Observable } from 'rxjs';
import { MenuSiderService } from '../../core/service/menu-sider.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-file',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MenuSiderComponent, CommonModule],
  templateUrl: './manager-file.component.html',
  styleUrl: './manager-file.component.scss',
})
export class ManagerFileComponent {

  isMenuVisible$: Observable<boolean>;

  constructor(private menuSiderService: MenuSiderService) {
    this.isMenuVisible$ = this.menuSiderService.isVisible$;
  }

}
