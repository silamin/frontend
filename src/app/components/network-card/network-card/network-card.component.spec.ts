import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCardComponent } from './network-card.component';

describe('NetworkCardComponent', () => {
  let component: NetworkCardComponent;
  let fixture: ComponentFixture<NetworkCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
