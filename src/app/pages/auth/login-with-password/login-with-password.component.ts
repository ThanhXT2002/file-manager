import { Component } from '@angular/core';
import { BasicPage } from '../../../core/shares/basic-page';
import { GlobalService } from '../../../core/service/global.server';
import { CommonModule } from '@angular/common';
import { AuthLibModule } from '../../../core/modules/auth-lib.module';

@Component({
  selector: 'app-login-with-password',
  imports: [
    CommonModule,
    AuthLibModule,

  ],
  templateUrl: './login-with-password.component.html',
  styleUrl: './login-with-password.component.scss',
})
export class LoginWithPasswordComponent extends BasicPage {
  constructor(protected override globalSer: GlobalService) {
    super(globalSer);
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }
}
