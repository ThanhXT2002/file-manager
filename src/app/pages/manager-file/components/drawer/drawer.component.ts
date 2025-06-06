import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { LogoComponent } from "../../../components/logo/logo.component";
import { ToggleAvatarComponent } from "../toggle-avatar/toggle-avatar.component";
import { MenuSiderComponent } from "../menu-sider/menu-sider.component";

@Component({
  selector: 'app-drawer',
  imports: [
    DrawerModule,
    CommonModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    LogoComponent,
    ToggleAvatarComponent,
    MenuSiderComponent
],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
})
export class DrawerComponent {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e:any): void {
    this.drawerRef.close(e);
  }
  isShowDrawer: boolean = false;
}
