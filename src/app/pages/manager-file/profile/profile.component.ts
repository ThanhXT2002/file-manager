import { Component } from '@angular/core';
import { BasicPage } from '../../../core/shares/basic-page';
import { GlobalService } from '../../../core/service/global.service';
import { GlobalModule } from '../../../core/modules/global.module';

@Component({
  selector: 'app-profile',
  imports: [GlobalModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent extends BasicPage {




  constructor(protected override globalSer: GlobalService) {
    super(globalSer);
    this.createDelayObservable().subscribe((value) => {
      this.pageLoaded();
    });
  }

  ngOnInit() {
    // Initialization logic here
  }
}
