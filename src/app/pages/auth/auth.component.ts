import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from '../../core/service/global.server';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  
  constructor(
    protected globalSer: GlobalService
  ) {}
}
