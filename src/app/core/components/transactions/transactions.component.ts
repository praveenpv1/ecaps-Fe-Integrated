import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  dateRangeForm!: FormGroup;
  searchText = "";
  walletTransactionList: any;

  constructor(
    private tR: TransactionReducers,
    private ds: DataStore,
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) { }

  submitForm(): void {
    for (const i in this.dateRangeForm.controls) {
      this.dateRangeForm.controls[i].markAsDirty();
      this.dateRangeForm.controls[i].updateValueAndValidity();
    }
    if (this.dateRangeForm.valid) {
      const payload = {
        startDate: moment(this.dateRangeForm.value.rangePicker[0]).toISOString(),
        endDate: moment(this.dateRangeForm.value.rangePicker[1]).toISOString(),
      }
      this.store.dispatch(new GetTransactionListAction(payload));
    }
  }

  ngOnInit() {
    this.store.dispatch(new GetTransactionListAction({}));
    // this.tR.transactionReducer({ type: GET_WALLET_TRANSACTION_LIST });

    this.store.subscribe(({ transactionState }) => {
      this.walletTransactionList = _.get(
        transactionState.userWalletTransactionList,
        "transaction_recs"
      );

      // filter data with no txn amount
      this.walletTransactionList = _.filter(
        this.walletTransactionList,
        (obj) => obj.trn_amount
      );

      //reverse wallet data
      this.walletTransactionList = _.reverse(this.walletTransactionList);
    });

    this.dateRangeForm = this.fb.group({
      rangePicker: [[], [Validators.required]],
      txnType: [null, [Validators.required]]
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
}
