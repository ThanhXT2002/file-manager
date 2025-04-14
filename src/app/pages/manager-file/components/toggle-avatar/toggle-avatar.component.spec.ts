import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleAvatarComponent } from './toggle-avatar.component';

describe('ToggleAvatarComponent', () => {
  let component: ToggleAvatarComponent;
  let fixture: ComponentFixture<ToggleAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
