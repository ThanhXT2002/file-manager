import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSpeedDialComponent } from './auth-speed-dial.component';

describe('AuthSpeedDialComponent', () => {
  let component: AuthSpeedDialComponent;
  let fixture: ComponentFixture<AuthSpeedDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSpeedDialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthSpeedDialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
