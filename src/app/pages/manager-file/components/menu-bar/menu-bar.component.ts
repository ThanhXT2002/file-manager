import { Component, inject } from '@angular/core';
import { PrimeIcons, MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

import { BadgeModule } from 'primeng/badge';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  imports: [CommonModule, AvatarModule, BadgeModule, RouterModule],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.scss',
})
export class MenuBarComponent {
  items!: MenuItem[];
  notifi:number = 1;
}
