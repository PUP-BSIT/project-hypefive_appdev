import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDialogComponent } from './post-dialog.component';

describe('PostDialogComponent', () => {
  let component: PostDialogComponent;
  let fixture: ComponentFixture<PostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
