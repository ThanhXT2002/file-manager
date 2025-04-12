import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';



@NgModule({
  declarations: [],
  imports: [CommonModule, InputGroup],
  exports: [
    FloatLabelModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    InputGroupAddonModule,
    InputGroupModule
  ],
})
export class AuthLibModule {}
