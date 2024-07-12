import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnModalComponent } from './an-modal.component';

describe('AnModalComponent', () => {
  let component: AnModalComponent;
  let fixture: ComponentFixture<AnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
