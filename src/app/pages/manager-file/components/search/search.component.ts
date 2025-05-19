import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FileService } from '../../../../core/service/file.service';

@Component({
  selector: 'app-search',
  imports: [InputIcon, IconField, InputTextModule, FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  searchTerm:string = '';
  loading:boolean = false;

    constructor(
      private fileService: FileService
    ) {

    }

    // Tìm kiếm file
  // searchFiles(): void {
  //   if (!this.searchTerm.trim()) {
  //     this.loadFiles();
  //     return;
  //   }

  //   this.loading = true;
  //   this.fileService.searchFiles({ searchTerm: this.searchTerm }, 1, this.pageSize)
  //     .subscribe({
  //       next: (response) => {
  //         this.fileList = response.data?.items || [];
  //         this.totalRecords = response.data?.totalCount || 0;
  //         this.loading = false;
  //       },
  //       error: (error) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Lỗi',
  //           detail: 'Không thể tìm kiếm tệp tin'
  //         });
  //         this.loading = false;
  //       }
  //     });
  // }


}
