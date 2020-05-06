import { DataStore } from "@app/core/store/app.store";
import { Component, OnInit } from "@angular/core";
import { TransactionReducers } from "@app/core/store/reducers/transaction.reducer";
import { GET_WALLET_TRANSACTION_LIST } from "@app/core/store/actions";
import * as _ from "lodash";

@Component({
  selector: "app-transactions",
  templateUrl: "./transactions.component.html",
  styleUrls: ["./transactions.component.scss"],
})
export class TransactionsComponent implements OnInit {
  searchText = "";
  walletTransactionList: any;
  constructor(private tR: TransactionReducers, private ds: DataStore) {}

  ngOnInit() {
    this.tR.transactionReducer({ type: GET_WALLET_TRANSACTION_LIST });

    this.ds.dataStore$.subscribe((data) => {
      this.walletTransactionList = _.get(
        data.userWalletTransactionList,
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
  }
}
