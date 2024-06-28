import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTodayComponent } from './admin-today.component';

describe('AdminTodayComponent', () => {
  let component: AdminTodayComponent;
  let fixture: ComponentFixture<AdminTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTodayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
