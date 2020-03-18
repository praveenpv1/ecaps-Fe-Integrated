import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletLoadRequestComponent } from './wallet-load-request.component';

describe('WalletLoadRequestComponent', () => {
  let component: WalletLoadRequestComponent;
  let fixture: ComponentFixture<WalletLoadRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletLoadRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletLoadRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
