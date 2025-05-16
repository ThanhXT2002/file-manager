import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChunkedUploaderComponent } from './chunked-uploader.component';

describe('ChunkedUploaderComponent', () => {
  let component: ChunkedUploaderComponent;
  let fixture: ComponentFixture<ChunkedUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChunkedUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChunkedUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
