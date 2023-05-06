import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesJobsComponent } from './likes-jobs.component';

describe('LikesJobsComponent', () => {
  let component: LikesJobsComponent;
  let fixture: ComponentFixture<LikesJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikesJobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikesJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
