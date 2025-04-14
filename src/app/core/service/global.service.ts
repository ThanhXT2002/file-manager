import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { utilHelper } from '../helpers/util';
import { HttpHeaders } from '@angular/common/http';
import { EErrorIndicatorType } from '../components/error-indicator/error-indicator.component';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  public loadIndicator$ = new BehaviorSubject<boolean>(true);

  public errorIndicator$ = new BehaviorSubject<boolean>(false);
  public errorIndicatorType$ = new BehaviorSubject<EErrorIndicatorType>(
    EErrorIndicatorType.NoDataFound
  );

  constructor() {}

  public openLoading() {
    this.loadIndicator$.next(true);
  }
  public closeLoading() {
    this.loadIndicator$.next(false);
  }

  public getHttpOptions() {
    let token = this.getToken();
    if (token == undefined) return { headers: new HttpHeaders() };
    return { headers: new HttpHeaders({ Authorization: token }) };
  }

  public getToken() {
    return localStorage[utilHelper.localStorage.token];
  }

  public hasToken() {
    let token = localStorage[utilHelper.localStorage.token];
    return token != null && token.length > 0;
  }
}
