import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuSiderService {
  private isVisibleSubject = new BehaviorSubject<boolean>(true);
  public isVisible$: Observable<boolean> = this.isVisibleSubject.asObservable();

  constructor() {}

  toggle(): void {
    this.isVisibleSubject.next(!this.isVisibleSubject.value);
  }

  show(): void {
    this.isVisibleSubject.next(true);
  }

  hide(): void {
    this.isVisibleSubject.next(false);
  }

  get currentState(): boolean {
    return this.isVisibleSubject.value;
  }
}
