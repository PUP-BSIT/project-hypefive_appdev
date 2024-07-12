import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageMainComponent } from './landing-page-main.component';

describe('LandingPageMainComponent', () => {
  let component: LandingPageMainComponent;
  let fixture: ComponentFixture<LandingPageMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LandingPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
