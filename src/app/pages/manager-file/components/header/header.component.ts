import { Component } from '@angular/core';
import { DrawerComponent } from "../drawer/drawer.component";
import { LogoComponent } from "../../../../core/components/logo/logo.component";
import { ToggleDarkModeComponent } from "../toggle-dark-mode/toggle-dark-mode.component";
import { MenuBarComponent } from "../menu-bar/menu-bar.component";

@Component({
  selector: 'app-header',
  imports: [DrawerComponent, LogoComponent, ToggleDarkModeComponent, MenuBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
