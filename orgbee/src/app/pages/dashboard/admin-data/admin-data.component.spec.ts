import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDataComponent } from './admin-data.component';

describe('AdminDataComponent', () => {
  let component: AdminDataComponent;
  let fixture: ComponentFixture<AdminDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
