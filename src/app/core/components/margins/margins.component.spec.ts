import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginsComponent } from './margins.component';

describe('MarginsComponent', () => {
  let component: MarginsComponent;
  let fixture: ComponentFixture<MarginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
