import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-toggle-notifi',
  imports: [CommonModule, BadgeModule, DrawerModule],
  templateUrl: './toggle-notifi.component.html',
  styleUrl: './toggle-notifi.component.scss',
})
export class ToggleNotifiComponent {
  notifi: number = 1;
  isShowNotifi: boolean = false;
  toggleNotifi() {
    this.isShowNotifi = !this.isShowNotifi;
  }
}
