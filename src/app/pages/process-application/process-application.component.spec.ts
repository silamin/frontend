import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessApplicationComponent } from './process-application.component';

describe('ProcessApplicationComponent', () => {
  let component: ProcessApplicationComponent;
  let fixture: ComponentFixture<ProcessApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessApplicationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
