import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
      path: 'home',
      component: HomeComponent,
  },
  {
      path: 'profile',
      component: ProfileComponent,
  },
  {
      path: 'setting',
      component: SettingComponent,
  },
  {
      path: 'notification',
      component: NotificationComponent,
  },

];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerFileRouting {}
