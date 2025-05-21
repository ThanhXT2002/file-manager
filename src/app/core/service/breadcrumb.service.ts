import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSource = new BehaviorSubject<MenuItem[]>([
    { label: 'My Files', routerLink: '/manager-file/my-files' }
  ]);
  public breadcrumbs$ = this.breadcrumbsSource.asObservable();

  constructor() { }

  updateBreadcrumbs(breadcrumbs: MenuItem[]): void {
    setTimeout(() => {
    this.breadcrumbsSource.next(breadcrumbs);
  });
  }

  reset(): void {
    this.breadcrumbsSource.next([
      { label: 'My Files', routerLink: '/manager-file/my-files' }
    ]);
  }
}
