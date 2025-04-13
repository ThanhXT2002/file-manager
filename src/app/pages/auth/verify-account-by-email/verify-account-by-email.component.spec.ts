import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountByEmailComponent } from './verify-account-by-email.component';

describe('VerifyAccountByEmailComponent', () => {
  let component: VerifyAccountByEmailComponent;
  let fixture: ComponentFixture<VerifyAccountByEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyAccountByEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyAccountByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
