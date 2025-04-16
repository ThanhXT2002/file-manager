import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { interval, Subscription, takeWhile } from 'rxjs';
import { GlobalModule } from '../../../../core/modules/global.module';
import { AuthLibModule } from '../../../../core/modules/auth-lib.module';
import { GlobalService } from '../../../../core/service/global.service';
import { AuthService } from '../../../../core/service/auth.service';
import { ResponseHandlerService } from '../../../../core/service/response-handler.service';


@Component({
  selector: 'app-form-email-otp-child',
  imports: [GlobalModule, AuthLibModule],
  templateUrl: './form-email-otp-child.component.html',
  styleUrl: './form-email-otp-child.component.scss',
})
export class FormEmailOtpChildComponent implements OnDestroy {
  @Input() otpType: 'login' | 'forgot' | 'register' = 'login';
  @Input() set parentForm(form: FormGroup) {
    if (form) {
      // Đặt các FormControl từ form cha
      this.emailControl = form.get('email') as FormControl;
      this.otpControl = form.get('otp') as FormControl;
    }
  }

  @Output() otpStatusChange = new EventEmitter<number>();

  emailControl!: FormControl;
  otpControl!: FormControl;

  otpStatus: number = 0;
  private countdownTime = 5 * 60; // 5 minutes in seconds
  minutes = 5;
  seconds = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private globalService: GlobalService,
    private authService: AuthService,
    private responseHandler: ResponseHandlerService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getOtp() {
    if (this.emailControl?.valid) {
      this.globalService.openLoading();

      let request;
      if (this.otpType === 'login') {
        request = this.authService.getOtpLogin(this.emailControl.value);
      } else if (this.otpType === 'forgot') {
        request = this.authService.getOtpFogotPassword(this.emailControl.value);
      } else {
        request = this.authService.resendRegisterOtp(this.emailControl.value);
      }

      this.subscriptions.push(
        request.subscribe({
          next: () => {
            this.responseHandler.handleSuccess('auth.send-otp-success', () => {
              this.startCountdown();
            });
          },
          error: (error) => {
            this.responseHandler.handleErrorWithUnverifiedCheck(
              error,
              () => this.emailControl.value
            );
          },
        })
      );
    }
  }

  resendOtp() {
    if (this.emailControl?.valid) {
      this.globalService.openLoading();

      let request;
      if (this.otpType === 'login') {
        request = this.authService.resendOptLogin(this.emailControl.value);
      } else if (this.otpType === 'forgot') {
        request = this.authService.resendOptFogotPassword(
          this.emailControl.value
        );
      } else {
        request = this.authService.resendRegisterOtp(this.emailControl.value);
      }

      this.subscriptions.push(
        request.subscribe({
          next: () => {
            this.responseHandler.handleSuccess('auth.send-otp-success', () => {
              this.startCountdown();
            });
          },
          error: (error) => {
            this.responseHandler.handleErrorWithUnverifiedCheck(
              error,
              () => this.emailControl.value
            );
          },
        })
      );
    }
  }

  private startCountdown() {
    // Set status to counting down
    this.setOtpStatus(1);

    // Stop any existing countdown
    this.stopCountdown();

    // Reset time
    let remainingTime = this.countdownTime;

    // Update initial display
    this.updateDisplay(remainingTime);

    // Create a new countdown timer
    this.subscriptions.push(
      interval(1000)
        .pipe(takeWhile(() => remainingTime > 0))
        .subscribe(() => {
          remainingTime--;
          this.updateDisplay(remainingTime);

          if (remainingTime <= 0) {
            // When countdown finishes, set status to finished
            this.setOtpStatus(2);
            this.stopCountdown();
          }
        })
    );
  }

  private stopCountdown() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  private updateDisplay(timeInSeconds: number) {
    this.minutes = Math.floor(timeInSeconds / 60);
    this.seconds = timeInSeconds % 60;
  }

  private setOtpStatus(status: number) {
    this.otpStatus = status;
    this.otpStatusChange.emit(status);
  }
}
