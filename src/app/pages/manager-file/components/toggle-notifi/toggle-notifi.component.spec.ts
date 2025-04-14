import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleNotifiComponent } from './toggle-notifi.component';

describe('ToggleNotifiComponent', () => {
  let component: ToggleNotifiComponent;
  let fixture: ComponentFixture<ToggleNotifiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleNotifiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleNotifiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
