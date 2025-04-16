import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEmailOtpChildComponent } from './form-email-otp-child.component';

describe('FormEmailOtpChildComponent', () => {
  let component: FormEmailOtpChildComponent;
  let fixture: ComponentFixture<FormEmailOtpChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEmailOtpChildComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormEmailOtpChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
