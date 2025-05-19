import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { NotificationComponent } from './notification/notification.component';
import { authGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'my-files', pathMatch: 'full' },
  {
    path: 'my-files',
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
  {
    path: 'files/:encryptedId',
    component: HomeComponent
  },
  {
    path: 'trash',
    component: HomeComponent,
    data: { mode: 'trash' }
  },
  {
    path: 'favorites',
    component: HomeComponent,
    data: { mode: 'favorites' }
  }
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerFileRouting {}
