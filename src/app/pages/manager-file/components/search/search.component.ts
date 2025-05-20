import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FileService } from '../../../../core/service/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [InputIcon, IconField, InputTextModule, FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private fileService: FileService,
    private router: Router
  ) {}

  // Thực hiện tìm kiếm khi người dùng nhấn Enter
  onSearch(): void {
    if (this.searchTerm.trim()) {
      // Chuyển hướng đến trang search với keyword
      this.router.navigate(['/manager-file/search', encodeURIComponent(this.searchTerm.trim())]);
    }
  }


}
