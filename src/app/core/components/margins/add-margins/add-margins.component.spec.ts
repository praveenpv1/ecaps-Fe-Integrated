import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarginsComponent } from './add-margins.component';

describe('AddMarginsComponent', () => {
  let component: AddMarginsComponent;
  let fixture: ComponentFixture<AddMarginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarginsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
