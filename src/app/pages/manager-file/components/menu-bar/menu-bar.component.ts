import { Component } from '@angular/core';
import { PrimeIcons, MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule, AvatarModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  items!: MenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: PrimeIcons.HOME,
        command: () => {
          // Handle home action
        },
      },
      {
        label: 'Profile',
        icon: PrimeIcons.USER,
        command: () => {
          // Handle profile action
        },
      },
      {
        label: 'Notifications',
        icon: PrimeIcons.BELL,
        command: () => {
          // Handle profile action
        },
      },
      {
        label: 'Settings',
        icon: PrimeIcons.COG,
        command: () => {
          // Handle settings action
        },
      },
    ];
  }
}
