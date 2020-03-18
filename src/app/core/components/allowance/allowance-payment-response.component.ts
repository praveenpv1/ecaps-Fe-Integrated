import { Component, OnInit } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { Router } from "@angular/router";
import * as _ from "lodash";

@Component({
  selector: "koppr-pot",
  templateUrl: "./allowance-payment-response.component.html",
  styleUrls: ["./allowance-payment-response.component.scss"]
})
export class AllowancePaymentResponseComponent implements OnInit {
  constructor(private _dataStore: DataStore, private route: Router) {}

  totalAmount: number = 0;
  companyBalance: string = "";

  ngOnInit() {
    const state = this._dataStore.dataStore$.getValue();
    this.companyBalance = _.get(state.company.details, "data.value", 0);

    setTimeout(() => {
      this.route.navigate(["/", "dashboard"]);
    }, 5000);

    this.getTotalAmount();
  }

  getTotalAmount(): number {
    const state = this._dataStore.dataStore$.getValue();
    this.totalAmount = 0;
    state.allowance.pay.employees.forEach(element => {
      this.totalAmount += element.amount;
    });
    return this.totalAmount;
  }
}
