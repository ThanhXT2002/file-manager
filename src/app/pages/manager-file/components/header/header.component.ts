import { Component } from '@angular/core';
import { DrawerComponent } from "../drawer/drawer.component";
import { LogoComponent } from "../../../components/logo/logo.component";
import { ToggleDarkModeComponent } from "../toggle-dark-mode/toggle-dark-mode.component";
import { MenuBarComponent } from "../menu-bar/menu-bar.component";
import { User } from '../../../../core/interfaces/user.interface';
import { ToggleNotifiComponent } from "../toggle-notifi/toggle-notifi.component";
import { ToggleAvatarComponent } from "../toggle-avatar/toggle-avatar.component";

@Component({
  selector: 'app-header',
  imports: [
    DrawerComponent,
    LogoComponent,
    ToggleDarkModeComponent,
    ToggleNotifiComponent,
    ToggleAvatarComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  currentUser: User | null = null;
}
