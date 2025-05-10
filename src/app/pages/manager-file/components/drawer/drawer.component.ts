import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
import { LogoComponent } from "../../../components/logo/logo.component";

@Component({
  selector: 'app-drawer',
  imports: [
    DrawerModule,
    CommonModule,
    ButtonModule,
    Ripple,
    AvatarModule,
    StyleClass,
    LogoComponent
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
