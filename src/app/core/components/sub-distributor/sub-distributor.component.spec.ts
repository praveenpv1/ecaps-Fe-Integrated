import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubDistributorComponent } from './sub-distributor.component';

describe('SubDistributorComponent', () => {
  let component: SubDistributorComponent;
  let fixture: ComponentFixture<SubDistributorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubDistributorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubDistributorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
