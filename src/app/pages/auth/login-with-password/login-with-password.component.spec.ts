import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginWithPasswordComponent } from './login-with-password.component';

describe('LoginWithPasswordComponent', () => {
  let component: LoginWithPasswordComponent;
  let fixture: ComponentFixture<LoginWithPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginWithPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginWithPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
