import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-manager-file',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './manager-file.component.html',
  styleUrl: './manager-file.component.scss',
})
export class ManagerFileComponent {
}
