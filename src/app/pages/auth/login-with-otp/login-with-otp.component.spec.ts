import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithOtpComponent } from './login-with-otp.component';

describe('LoginWithOtpComponent', () => {
  let component: LoginWithOtpComponent;
  let fixture: ComponentFixture<LoginWithOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginWithOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginWithOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
