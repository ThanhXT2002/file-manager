import { Component } from '@angular/core';
import { GlobalService } from '../../../core/service/global.service';
import { BasicPage } from '../../../core/shares/basic-page';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BasicPage {


  constructor(
    protected override globalSer: GlobalService,
  ) {
    super(globalSer);
  }
  ngOnInit() {
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }


}
