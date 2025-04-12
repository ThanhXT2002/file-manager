import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkRegisterForgotPasswordComponent } from './link-register-forgot-password.component';

describe('LinkRegisterForgotPasswordComponent', () => {
  let component: LinkRegisterForgotPasswordComponent;
  let fixture: ComponentFixture<LinkRegisterForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkRegisterForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkRegisterForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
