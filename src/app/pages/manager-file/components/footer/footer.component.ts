import { Component } from '@angular/core';
import { MenuBarComponent } from "../menu-bar/menu-bar.component";

@Component({
  selector: 'app-footer',
  imports: [MenuBarComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
