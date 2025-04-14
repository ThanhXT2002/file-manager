import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CustomToastService } from '../../core/service/custom-toast.service';
import { BasicPage } from '../../core/shares/basic-page';
import { GlobalService } from '../../core/service/global.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-test',
  imports: [CommonModule, ButtonModule, TranslateModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent extends BasicPage {
  constructor(
    private toastService: CustomToastService,
    protected override globalSer: GlobalService
  ) {
    super(globalSer);
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit() {
    this.showSuccessToast();
  }

  showSuccessToast(): void {
    this.toastService.showToast('success', {
      detail: 'Dữ liệu đã được lưu thành công.',
      sticky: false,
      life: 110000,
    });
  }

  showSuccessToastWithAction(): void {
    this.toastService.showToast('success', {
      detail: 'Dữ liệu đã được lưu thành công. Bạn có muốn xem chi tiết?',
      action: {
        label: 'Xem chi tiết',
        callback: () => {
          console.log('Đã nhấp vào xem chi tiết');
          // Thêm logic điều hướng hoặc hiển thị chi tiết
        },
      },
    });
  }

  showInfoToast(): void {
    this.toastService.showToast('info', {
      summary: '',
      detail: 'Có bản cập nhật mới cho ứng dụng.',
      sticky: false,
      life: 5000,
    });
  }

  showInfoToastWithAction(): void {
    this.toastService.showToast('info', {
      summary: '',
      detail: 'Có bản cập nhật mới cho ứng dụng.',
      action: {
        label: 'Cập nhật ngay',
        callback: () => {
          console.log('Đã nhấp vào cập nhật');
          // Thêm logic cập nhật
        },
      },
    });
  }

  showWarningToast(): void {
    this.toastService.showToast('warn', {
      summary: '',
      detail: 'Phiên làm việc của bạn sắp hết hạn.',
      sticky: false,
      life: 7000,
    });
  }

  showWarningToastWithAction(): void {
    this.toastService.showToast('warn', {
      summary: 'Cảnh báo',
      detail: 'Phiên làm việc của bạn sắp hết hạn.',
      action: {
        label: 'Gia hạn',
        callback: () => {
          console.log('Đã nhấp vào gia hạn');
          // Thêm logic gia hạn phiên
        },
      },
    });
  }

  showErrorToast(): void {
    this.toastService.showToast('error', {
      summary: 'Lỗi',
      detail: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
      sticky: false,
      life: 8000,
    });
  }

  showErrorToastWithAction(): void {
    this.toastService.showToast('error', {
      summary: 'Lỗi',
      detail: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
      action: {
        label: 'Thử lại',
        callback: () => {
          console.log('Đã nhấp vào thử lại');
          // Thêm logic thử lại
        },
      },
    });
  }
}
