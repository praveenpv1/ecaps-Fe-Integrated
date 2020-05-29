import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
import { DataStore } from "@app/core/store/app.store";
import { Store } from "@ngxs/store";

@Component({
  selector: "app-view-transactions",
  templateUrl: "./view-transactions.component.html",
  styleUrls: ["./view-transactions.component.scss"],
})
export class ViewTransactionsComponent implements OnInit {
  viewDetails: any;

  constructor(private ds: DataStore, private store: Store) {}

  ngOnInit() {
    this.store.subscribe(({ transactionState }) => {
      if (transactionState.selectedTransactionItem) {
        this.viewDetails = transactionState.selectedTransactionItem;
        console.log(this.viewDetails);
      }
    });
    // this.ds.dataStore$.subscribe((data) => {
    //   console.log("**************", data);
    //   if (data.selectedTransactionItem) {
    //     this.viewDetails = data.selectedTransactionItem;
    //     console.log(this.viewDetails);
    //   }
    // });
  }
}
