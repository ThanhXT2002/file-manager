import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ManagerFileComponent } from './pages/manager-file/manager-file.component';
import { AdminComponent } from './pages/admin/admin.component';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';


export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () =>
      import('./pages/auth/auth.routing').then((m) => m.AuthRouting),
    providers: [importProvidersFrom(TranslateModule.forChild())],
  },
  {
    path: 'manager-file',
    component: ManagerFileComponent,
    loadChildren: () =>
      import('./pages/manager-file/manager-file.routing').then(
        (m) => m.ManagerFileRouting
      ),
    providers: [importProvidersFrom(TranslateModule.forChild())],
  },
  {
    path: 'System-admin',
    component: AdminComponent,
    loadChildren: () =>
      import('./pages/admin/admin.routing').then((m) => m.AdminRouting),
    providers: [importProvidersFrom(TranslateModule.forChild())],
  },
];
