import { Component, Inject, inject, Injector, OnDestroy } from "@angular/core";
import { Observable, Subscription, delay, of } from "rxjs";

import { HttpErrorResponse } from "@angular/common/http";


import { GlobalService } from "../service/global.service";

import { EErrorIndicatorType } from "../../pages/components/error-indicator/error-indicator.component";
import { TranslateService } from "@ngx-translate/core";


@Component({ template: '' })
export class BasicPage implements OnDestroy {
  // protected userProfile: MyAccountResponse | null = null;

  protected _ready: boolean = false;

  protected _subscriptions: Subscription[] = [];


  constructor(protected globalSer: GlobalService) {
    this.openLoading();
    // this.loadUserProfile();
  }

  // protected loadUserProfile(): void {
  //   const profileStr = localStorage.getItem('my-profile');
  //   if (profileStr) {
  //     try {
  //       this.userProfile = JSON.parse(profileStr);
  //     } catch (error) {
  //       console.error('Error parsing user profile:', error);
  //     }
  //   }
  // }

  // protected getUserProfile(): MyAccountResponse | null {
  //   return this.userProfile;
  // }

  public pageLoaded() {
    this._ready = true;
    this.globalSer.errorIndicator$.next(false);
    this.closeLoading();
  }

  public pageError(e?: HttpErrorResponse) {
    this._ready = false;
    this.closeLoading();
    this.globalSer.errorIndicator$.next(true);

    if (e == undefined) {
      this.globalSer.errorIndicatorType$.next(EErrorIndicatorType.NoDataFound);
      return;
    }

    try {
      switch (e.status) {
        case 401: {
          this.globalSer.errorIndicatorType$.next(
            EErrorIndicatorType.NoDataFound
          );
          break;
        }
        case 403: {
          this.globalSer.errorIndicatorType$.next(
            EErrorIndicatorType.Unauthorize
          );
          break;
        }
        case 404: {
          this.globalSer.errorIndicatorType$.next(
            EErrorIndicatorType.NoDataFound
          );
          break;
        }
        default: {
          this.globalSer.errorIndicatorType$.next(
            EErrorIndicatorType.Forbidden
          );
          break;
        }
      }
    } catch (ex) {
      console.log(ex, e);
      this.globalSer.errorIndicatorType$.next(EErrorIndicatorType.NoDataFound);
    }
  }

  ngOnDestroy(): void {
    for (var subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
  }

  public openLoading() {
    this.globalSer.openLoading();
  }

  public closeLoading() {
    this.globalSer.closeLoading();
  }

  public beginCallApi() {
    this.globalSer.openLoading();
  }

  public createDelayObservable(seconds = 0.1): Observable<string> {
    let fakeObservable = of('').pipe(delay(seconds * 1000));
    return fakeObservable;
  }


  toggleDarkMode() {
    const element = document.querySelector('html');
    if (!element) return;
    element.classList.toggle('dark');

    // Nếu muốn lưu trạng thái người dùng đã chọn
    const isDarkMode = element.classList.contains('dark');
    localStorage.setItem('darkMode', isDarkMode ? 'true' : 'false');
  }
}
