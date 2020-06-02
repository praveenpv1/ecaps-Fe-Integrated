import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataStore } from "@app/core/store/app.store";
import * as moment from "moment";
import { TransactionReducers } from "@app/core/store/reducers/transaction.reducer";
import {
  GET_WALLET_TRANSACTION_LIST,
  SAVE_SELECTED_TRANSACTION_ITEM,
} from "@app/core/store/actions";
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
    // const payload = {
    //   startDate: moment(result[0]).toISOString(),
    //   endDate: moment(result[1]).toISOString(),
    // };
    this.dateRange = result;
    // this.store.dispatch(new GetTransactionListAction(payload));
    this.resetPaginationData();
    this.getTransactionList();
  }

  onTxnTypeChange(value: { label: string; value: string }): void {
    console.log(value);
  }

  ngOnInit() {
    // const payload = {
    //   startDate: moment(this.dateRange[0]).toISOString(),
    //   endDate: moment(this.dateRange[1]).toISOString(),
    //   pageNumber: this.pageNumber,
    //   pageSize: this.pageSize,
    // };

    // this.store.dispatch(new GetTransactionListAction(payload));
    this.getTransactionList();

    // this.tR.transactionReducer({ type: GET_WALLET_TRANSACTION_LIST });
    let apiTransactionList = [];
    this.store.subscribe(({ transactionState }) => {
      apiTransactionList = _.get(
        transactionState.userWalletTransactionList,
        "transaction_recs",
        []
      );

      this.showViewMore = !_.isEmpty(apiTransactionList);

      // filter data with no txn amount
      apiTransactionList = _.filter(
        apiTransactionList,
        (obj) => obj.trn_amount
      );

      //reverse wallet data
      apiTransactionList = _.reverse(apiTransactionList);

      this.walletTransactionList = [
        ...this.walletTransactionList,
        ...apiTransactionList,
      ];
      this.walletTransactionList = _.uniqBy(
        this.walletTransactionList,
        "wl_tr_id"
      );
    });

    // this.ds.dataStore$.subscribe((data) => {
    //   this.walletTransactionList = _.get(
    //     data.userWalletTransactionList,
    //     "transaction_recs"
    //   );

    //   // filter data with no txn amount
    //   this.walletTransactionList = _.filter(
    //     this.walletTransactionList,
    //     (obj) => obj.trn_amount
    //   );

    //   //reverse wallet data
    //   this.walletTransactionList = _.reverse(this.walletTransactionList);
    // });
  }
  viewTransactionsRoute(data) {
    if (data) {
      // this.tR.transactionReducer({
      //   type: SAVE_SELECTED_TRANSACTION_ITEM,
      //   payload: data,
      // });
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
      ...payload,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    this.store.dispatch(new GetTransactionListAction(params));
  }
}
