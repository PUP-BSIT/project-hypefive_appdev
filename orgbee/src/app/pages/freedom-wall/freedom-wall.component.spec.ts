import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreedomWallComponent } from './freedom-wall.component';

describe('FreedomWallComponent', () => {
  let component: FreedomWallComponent;
  let fixture: ComponentFixture<FreedomWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FreedomWallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FreedomWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
