import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFileComponent } from './manager-file.component';

describe('ManagerFileComponent', () => {
  let component: ManagerFileComponent;
  let fixture: ComponentFixture<ManagerFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerFileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
