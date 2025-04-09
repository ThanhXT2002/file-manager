import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginWithPasswordComponent } from "./login-with-password/login-with-password.component";


const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
       path: 'login', component: LoginWithPasswordComponent
    }
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRouting {}
