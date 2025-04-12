import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginWithPasswordComponent } from "./login-with-password/login-with-password.component";
import { LoginWithOtpComponent } from "./login-with-otp/login-with-otp.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { VerifyAccountComponent } from "./verify-account/verify-account.component";
import { RegisterComponent } from "./register/register.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginWithPasswordComponent,
  },
  {
    path: 'login-otp',
    component: LoginWithOtpComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'verify-account',
    component: VerifyAccountComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouting {}
