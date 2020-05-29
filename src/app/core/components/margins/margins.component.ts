import { Component, OnInit, OnDestroy } from "@angular/core";
// import { MarginReducers } from "@app/core/store/reducers/margin.reducer";
// import { GET_MARGIN_TYPE_LIST } from "@app/core/store/actions";
// import { DataStore } from "@app/core/store/app.store";
import { CurrencyPipe } from "@angular/common";
import { Store } from "@ngxs/store";
import { GetMarginListAction } from "@app/core/ngxs-store/ngxs-actions/margin.actions";

@Component({
  selector: "app-margins",
  templateUrl: "./margins.component.html",
  styleUrls: ["./margins.component.scss"],
})
export class MarginsComponent implements OnInit, OnDestroy {
  marginSet: string[] = [];
  selectedValue: any;
  marginList: any;
  storeSubscriber: any;
  searchText: string;
  constructor(
    // private mR: MarginReducers,
    // private ds: DataStore,
    private currencyPipe: CurrencyPipe,
    private store: Store
  ) {
    this.marginSet = ["Fundtransfer", "Recharge"];
    this.selectedValue = this.marginSet[0];
    this.marginList = [
      {
        margin_status: true,
        _id: "5ea924488082433d3844d24c",
        margin_type: "Fundtransfer",
        margin_mode: 1,
        margin_role: "admin",
        margin_actual: 2,
        __v: 0,
      },
      {
        margin_status: true,
        _id: "5ea924488082433d3844d24c",
        margin_type: "Fundtransfer",
        margin_mode: 2,
        margin_role: "admin",
        margin_actual: 2,
        __v: 0,
      },
    ];
  }

  ngOnInit() {
    this.getMarginList(this.selectedValue);
    // this.subscriber = this.ds.dataStore$.subscribe((data) => {
    //   this.marginList = data.marginList;
    // });
    this.storeSubscriber = this.store.subscribe(({ marginState }) => {
      this.marginList = marginState.marginList;
    });
  }
  ngOnDestroy(): void {
    this.storeSubscriber.unsubscribe();
  }
  marginChange(value: string) {
    this.getMarginList(value);
  }

  getMarginList(marginType: string = "") {
    // this.mR.marginReducer({
    //   type: GET_MARGIN_TYPE_LIST,
    //   payload: { marginType },
    // });
    this.store.dispatch(new GetMarginListAction(marginType));
  }

  displayMarginMode(data) {
    return data.margin_mode === 1 ? "Absolute" : "Percentage";
  }

  displayMarginValue(data) {
    return data.margin_mode === 1
      ? this.currencyPipe.transform(data.margin_actual, "INR")
      : `${data.margin_actual}%`;
  }
}
