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
import { InputOtp } from 'primeng/inputotp';



@NgModule({
  declarations: [],
  imports: [CommonModule, InputGroup, InputOtp],
  exports: [
    FloatLabelModule,
    PasswordModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputOtp,
  ],
})
export class AuthLibModule {}
