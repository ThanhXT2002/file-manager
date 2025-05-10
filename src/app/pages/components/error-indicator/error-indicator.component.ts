import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../core/service/global.service';

export enum EErrorIndicatorType {
  NoDataFound,
  Unauthorize,
  Forbidden,
}

@Component({
  selector: 'app-error-indicator',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './error-indicator.component.html',
  styleUrl: './error-indicator.component.scss'
})
export class ErrorIndicatorComponent {
  Type = EErrorIndicatorType;
  _type: EErrorIndicatorType = EErrorIndicatorType.NoDataFound;
  _subscriptions: Subscription[] = [];

  constructor(private globalSer: GlobalService, private router: Router) { }

  ngOnInit(): void {
    this._subscriptions.push(this.globalSer.errorIndicator$.subscribe(value => { }));
  }

  ngOnDestroy(): void {
    for (var subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  back() {
    window.history.back();
  }

  signIn() {
    this.router.navigate(['signin']);
  }

}
