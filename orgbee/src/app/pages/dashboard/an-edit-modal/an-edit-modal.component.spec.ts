import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnEditModalComponent } from './an-edit-modal.component';

describe('AnEditModalComponent', () => {
  let component: AnEditModalComponent;
  let fixture: ComponentFixture<AnEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnEditModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
