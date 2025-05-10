import { Component } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-menu-sider',
  imports: [
     Ripple,
     StyleClass
  ],
  templateUrl: './menu-sider.component.html',
  styleUrl: './menu-sider.component.scss'
})
export class MenuSiderComponent {

}
