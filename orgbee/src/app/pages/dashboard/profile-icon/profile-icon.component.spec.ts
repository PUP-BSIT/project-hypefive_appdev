import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileIconComponent } from './profile-icon.component';

describe('ProfileIconComponent', () => {
  let component: ProfileIconComponent;
  let fixture: ComponentFixture<ProfileIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
