import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { CustomToastService } from '../../service/custom-toast.service';
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-global-toast',
  imports: [CommonModule, Toast, ButtonModule, AvatarModule, TranslateModule],
  templateUrl: './global-toast.component.html',
  styleUrl: './global-toast.component.scss',
})
export class GlobalToastComponent {
  constructor(private toastService: CustomToastService) {}

  onCloseToast(type: string): void {
    this.toastService.clearToast(type as any);
  }

  onActionClick(type: string, callback: () => void): void {
    if (callback) {
      callback();
    }
    this.toastService.clearToast(type as any);
  }
}
