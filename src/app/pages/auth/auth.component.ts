import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from '../../core/service/global.service';
import { AuthSpeedDialComponent } from "../../core/components/auth-speed-dial/auth-speed-dial.component";

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, AuthSpeedDialComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {

}
