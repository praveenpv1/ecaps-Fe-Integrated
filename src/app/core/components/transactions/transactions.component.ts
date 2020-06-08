import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataStore } from "@app/core/store/app.store";
import * as moment from "moment";
import { TransactionReducers } from "@app/core/store/reducers/transaction.reducer";
import { Router } from "@angular/router";
import * as _ from "lodash";
import { Store } from "@ngxs/store";
import {
  GetTransactionListAction,
  SaveSelectedTransactionItemAcion,
} from "@app/core/ngxs-store/ngxs-actions/transactions.actions";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent implements OnInit {
  clearDate = false;
  searchText = "";
  walletTransactionList: any = [];
  dateRange: any;
  optionList = [
    { label: "None", value: "none" },
    { label: "Debit", value: "debit" },
    { label: "Credit", value: "credit" },
  ];
  selectedValue = { label: "None", value: "none" };
  showViewMore = true;
  pageNumber = 1;
  pageSize = 10;
  apiTransactionList: any = [];
  constructor(
    private tR: TransactionReducers,
    private ds: DataStore,
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.dateRange = [moment().subtract(7, "days").format(), moment().format()];
  }

  onDateChange(result: Date): void {
    this.walletTransactionList = [];
    this.apiTransactionList = [];
    this.dateRange = result;
    this.resetPaginationData();
    this.getTransactionList();
  }

  onTxnTypeChange(value: { label: string; value: string }): void {
    console.log(value);
  }

  ngOnInit() {
    this.getTransactionList();

    this.store.subscribe(({ transactionState }) => {
      this.apiTransactionList = _.get(
        transactionState.userWalletTransactionList,
        "transaction_recs",
        []
      );

      console.log("TRANSAC", this.apiTransactionList);

      this.showViewMore = !_.isEmpty(this.apiTransactionList);

      // filter data with no txn amount
      this.apiTransactionList = _.filter(
        this.apiTransactionList,
        (obj) => obj.trn_amount
      );

      //reverse wallet data
      this.apiTransactionList = _.reverse(this.apiTransactionList);

      this.walletTransactionList = [
        ...this.walletTransactionList,
        ...this.apiTransactionList,
      ];
      this.walletTransactionList = _.uniqBy(
        this.walletTransactionList,
        "wl_tr_id"
      );
      console.log("walletTransactionList", this.walletTransactionList);
    });
  }
  viewTransactionsRoute(data) {
    if (data) {
      this.store.dispatch(new SaveSelectedTransactionItemAcion(data));
      this.router.navigate(["/", "view-transactions", data._id]);
    }
  }

  disabledDate = (current: Date): boolean => {
    return moment(current).diff(moment()) > 0;
  };

  onViewMoreClick() {
    this.pageNumber++;
    this.getTransactionList();
  }

  resetPaginationData() {
    this.pageNumber = 1;
  }

  getTransactionList() {
    const payload = {
      startDate: moment(this.dateRange[0]).toISOString(),
      endDate: moment(this.dateRange[1]).toISOString(),
    };
    const params = {
      filters: JSON.stringify(payload),
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    this.store.dispatch(new GetTransactionListAction(params));
  }
}
