import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { ManagerFileComponent } from './pages/manager-file/manager-file.component';
import { AdminComponent } from './pages/admin/admin.component';
import { TranslateModule } from '@ngx-translate/core';
import { importProvidersFrom } from '@angular/core';
import { authGuard } from './core/guards/auth.guard';
import { nonAuthGuard } from './core/guards/non-auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'manager-file', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [nonAuthGuard],
    component: AuthComponent,
    loadChildren: () =>
      import('./pages/auth/auth.routing').then((m) => m.AuthRouting),
    providers: [importProvidersFrom(TranslateModule.forChild())],
  },
  {
    path: 'manager-file',
    canActivate: [authGuard],
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
  {
    path: 'test',
    loadComponent: () =>
      import('./pages/test/test.component').then((m) => m.TestComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page.component').then(
        (m) => m.NotFoundPageComponent
      ),
    providers: [importProvidersFrom(TranslateModule.forChild())],
  },
];
