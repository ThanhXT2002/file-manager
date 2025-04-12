import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-link-register-forgot-password',
  imports: [CommonModule,RouterModule,  TranslateModule],
  templateUrl: './link-register-forgot-password.component.html',
  styleUrl: './link-register-forgot-password.component.scss'
})
export class LinkRegisterForgotPasswordComponent {

}
