import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterCandidatesComponent } from './filter-candidates.component';

describe('FilterCandidatesComponent', () => {
  let component: FilterCandidatesComponent;
  let fixture: ComponentFixture<FilterCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterCandidatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
