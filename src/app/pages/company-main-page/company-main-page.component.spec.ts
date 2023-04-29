import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyMainPageComponent } from './company-main-page.component';

describe('CompanyMainPageComponent', () => {
  let component: CompanyMainPageComponent;
  let fixture: ComponentFixture<CompanyMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
