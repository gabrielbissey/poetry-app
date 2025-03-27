import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoemComponent } from './poem.component';

describe('PoemComponent', () => {
  let component: PoemComponent;
  let fixture: ComponentFixture<PoemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
