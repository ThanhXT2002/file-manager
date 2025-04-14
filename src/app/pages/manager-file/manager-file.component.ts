import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/service/auth.service';
import { GlobalService } from '../../core/service/global.service';
import { CustomToastService } from '../../core/service/custom-toast.service';
import { TranslateService } from '@ngx-translate/core';
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
