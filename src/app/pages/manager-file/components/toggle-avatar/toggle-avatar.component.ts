import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../../core/service/auth.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { GlobalService } from '../../../../core/service/global.service';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUpdateProfile, User } from '../../../../core/interfaces/user.interface';
import { TranslateService } from '@ngx-translate/core';
import { CustomToastService } from '../../../../core/service/custom-toast.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule, Dialog } from 'primeng/dialog';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponseHandlerService } from '../../../../core/service/response-handler.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NoCachePipe } from '../../../../core/pipe/no-cache.pipe';


class ItemMenu {
  title: string = '';
  iconFont: string = '';
  click: any;

  constructor(props: any = {}) {
    this.title = props.title || '';
    this.iconFont = props.iconFont || `<i class="fa-solid fa-user"></i>`;
    this.click =
      props.click ||
      function () {
        console.log('noavailable');
      };
  }
}

@Component({
  selector: 'app-toggle-avatar',
  imports: [
    AvatarModule,
    CommonModule,
    ButtonModule,
    RouterModule,
    DialogModule,
    InputTextModule,
    Dialog,
    FileUpload,
    FloatLabelModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './toggle-avatar.component.html',
  styleUrl: './toggle-avatar.component.scss',
})
export class ToggleAvatarComponent implements OnInit {
  menus: Array<ItemMenu> = [];
  private subscription!: Subscription;
  user: User | null = null;

  isShowDialogUpdateInfo: boolean = false;
  updateInforForm!: FormGroup;
  selectedFile: File | null = null;
  isShowBoxProfile: boolean = false;

  constructor(
    protected authService: AuthService,
    private globalService: GlobalService,
    private router: Router,
    private toastService: CustomToastService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private responseHandler: ResponseHandlerService
  ) {
    this.updateInforForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  lstItemMenus = {
    updateInfor: new ItemMenu({
      title: 'Cập nhật thông tin cá nhân',
      iconFont: `<i class="fa-solid fa-circle-up"></i>`,
      click: () => {
        this.isShowDialogUpdateInfo = true;
        this.isShowBoxProfile = false;
      },
    }),
    dashboard: new ItemMenu({
      title: 'Dashboard',
      iconFont: `<i class="fa-solid fa-gauge"></i>`,
      click: () => {
        this.router.navigate(['admin/dashboard']);
      },
    }),
    setting: new ItemMenu({
      title: 'Cài đặt',
      iconFont: `<i class="fa fa-cog"></i>`,
      click: () => {
        this.router.navigate(['/manager-file/setting']);
      },
    }),
    logout: new ItemMenu({
      title: 'Đăng xuất',
      iconFont: `<i class="fa-solid fa-right-from-bracket"></i>`,
      click: () => {
        this.logout();
      },
    }),
  };

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.reBuildMenu();
      this.updateInforForm.patchValue({
        fullName: user?.fullName,
        address: user?.address,
        avatar: user?.avatar,
      });
    });
  }

  reBuildMenu() {
    console.log('rebuild menu');
    this.menus = [];
    console.log('rebuild menu2');
    const { lstItemMenus } = this;
    console.log('user', this.user);
    if (this.user?.role == 1) {
      this.menus.push(lstItemMenus.dashboard);
    }
    this.menus.push(
      ...[lstItemMenus.updateInfor, lstItemMenus.setting, lstItemMenus.logout]
    );
    console.log('rebuild menu3', this.menus);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onFileSelect(event: any): void {
    if (event.files && event.files.length) {
      this.selectedFile = event.files[0];
    }
  }
  avatarVersion = 0;

  onUpdate(): void {
    if (this.updateInforForm.invalid) {
      return;
    }

    const updateData: IUpdateProfile = {
      fullName: this.updateInforForm.get('fullName')?.value,
      address: this.updateInforForm.get('address')?.value,
      avatar: this.selectedFile,
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.responseHandler.handleSuccess(
            'auth.update-user-information-success',
            () => {
              this.avatarVersion++;
              this.user = response.data; // Cập nhật thông tin người dùng
              this.isShowDialogUpdateInfo = false;
              this.selectedFile = null;
            }
          );
        }
      },
      error: (error) => {
        this.responseHandler.handleError(error);
      },
    });
  }

  logout() {
    this.globalService.openLoading();
    this.authService.logout().subscribe({
      next: () => {
        this.toastService.showToast('success', {
          detail: this.translateService.instant('profile.logout-success'),
          sticky: true,
          life: 5000,
        });
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.toastService.showToast('error', {
          detail: this.translateService.instant('profile.logout-failed'),
          sticky: true,
          life: 5000,
        });
      },
    });
  }

  onFileUploadError(event: any): void {
    console.log('File upload error:', event);
    // Lấy thông tin lỗi từ event
    if (event.type === 'filesize') {
      this.toastService.showToast('error', {
        detail: 'File quá lớn. Vui lòng chọn file có kích thước nhỏ hơn 20MB',
        life: 5000,
      });
    }
  }

  toggleBoxProfile() {
    this.isShowBoxProfile = !this.isShowBoxProfile;
  }
}
