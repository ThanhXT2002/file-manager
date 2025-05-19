import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { FileService } from '../../../../core/service/file.service';
import { TreeNode } from 'primeng/api';
import { FolderStructure } from '../../../../core/interfaces/file.interfaces';

@Component({
  selector: 'app-file-browser',
  imports: [CommonModule, TreeModule],
  templateUrl: './file-browser.component.html',
  styleUrl: './file-browser.component.scss'
})
export class FileBrowserComponent implements OnInit {
  private fileService = inject(FileService);

  @Output() folderSelected = new EventEmitter<number>();

  folders: TreeNode[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadFolders();
  }

  loadFolders(): void {
    this.loading = true;
    this.fileService.getFolderStructure().subscribe({
      next: (response) => {
        if (response.data) {
          this.folders = this.buildTreeNodes(response.data);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải cấu trúc thư mục', error);
        this.loading = false;
      }
    });
  }

  buildTreeNodes(folders: FolderStructure[]): TreeNode[] {
    return folders.map(folder => ({
      key: folder.id.toString(),
      label: folder.name,
      data: folder,
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: 'pi pi-folder',
      leaf: folder.children.length === 0,
      children: this.buildTreeNodes(folder.children)
    }));
  }

  onNodeSelect(event: any): void {
    const folderId = parseInt(event.node.key, 10);
    this.folderSelected.emit(folderId);
  }
}
