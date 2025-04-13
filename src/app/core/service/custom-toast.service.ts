import { Injectable } from '@angular/core';
import { ToastConfig, ToastType } from '../interfaces/toast.interface';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomToastService {
  private visible: Record<string, boolean> = {
    success: false,
    info: false,
    warn: false,
    error: false,
  };

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  showToast(type: ToastType, config: ToastConfig): void {
    if (!this.visible[type]) {
      // Nếu đã có summary, sử dụng ngay
      if (config.summary) {
        this.addToastMessage(type, config);
        return;
      }

      // Nếu không có summary, lấy summary mặc định theo ngôn ngữ
      this.getDefaultSummary(type).subscribe((summary) => {
        const updatedConfig = {
          ...config,
          summary,
        };
        this.addToastMessage(type, updatedConfig);
      });
    }
  }

  private addToastMessage(type: ToastType, config: ToastConfig): void {
    this.messageService.add({
      key: type,
      severity: type,
      summary: config.summary,
      detail: config.detail,
      sticky: config.sticky !== undefined ? config.sticky : true,
      life: config.life || 5000,
      closable: config.closable !== undefined ? config.closable : true,
      data: config.action || null,
    });

    this.visible[type] = true;
  }

  clearToast(type: ToastType): void {
    this.messageService.clear(type);
    this.visible[type] = false;
  }

  clearAll(): void {
    this.messageService.clear();
    Object.keys(this.visible).forEach((key) => {
      this.visible[key as ToastType] = false;
    });
  }

  private getDefaultSummary(type: ToastType): Observable<string> {
    let translationKey: string;

    switch (type) {
      case 'success':
        translationKey = 'toast.success';
        break;
      case 'info':
        translationKey = 'toast.info';
        break;
      case 'warn':
        translationKey = 'toast.warn';
        break;
      case 'error':
        translationKey = 'toast.error';
        break;
      default:
        return of('');
    }

    return this.translateService.get(translationKey);
  }
}
