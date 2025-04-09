import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    FloatLabelModule,
    PasswordModule
  ],
})
export class AuthLibModule {}
