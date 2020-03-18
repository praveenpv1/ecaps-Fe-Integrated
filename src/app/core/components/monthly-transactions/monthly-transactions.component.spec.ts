import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyTransactionsComponent } from './monthly-transactions.component';

describe('MonthlyTransactionsComponent', () => {
  let component: MonthlyTransactionsComponent;
  let fixture: ComponentFixture<MonthlyTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
