import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSiderComponent } from './menu-sider.component';

describe('MenuSiderComponent', () => {
  let component: MenuSiderComponent;
  let fixture: ComponentFixture<MenuSiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuSiderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuSiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
