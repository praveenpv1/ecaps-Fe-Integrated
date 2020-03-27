import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperDistributorComponent } from './super-distributor.component';

describe('SuperDistributorComponent', () => {
  let component: SuperDistributorComponent;
  let fixture: ComponentFixture<SuperDistributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperDistributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
