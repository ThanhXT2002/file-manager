import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbsSource = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$ = this.breadcrumbsSource.asObservable();

  constructor() { }

  updateBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    setTimeout(() => {
      this.breadcrumbsSource.next(breadcrumbs);
    });
  }

  reset(): void {
    this.breadcrumbsSource.next([]);
  }
}