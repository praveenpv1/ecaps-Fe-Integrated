import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import { DataStore } from "@app/core/store/app.store";

@Component({
  selector: "app-view-transactions",
  templateUrl: "./view-transactions.component.html",
  styleUrls: ["./view-transactions.component.scss"]
})
export class ViewTransactionsComponent implements OnInit {
  viewDetails: any;

  constructor(
    private ds: DataStore,
  ) { }

  ngOnInit() {
    this.ds.dataStore$.subscribe((data) => {
      console.log("**************",data)
      if(data.selectedTransactionItem){
        this.viewDetails = data.selectedTransactionItem
        console.log(this.viewDetails)
      }
    });
  } 
}