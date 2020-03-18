import { Component, OnInit } from "@angular/core";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import { EMPLOYEE_ADD_ALLOWANCE } from "@app/core/store/actions";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { Router } from "@angular/router";
import { DataStore } from "@app/core/store/app.store";

@Component({
  selector: "koppr-pot",
  templateUrl: "./confirm-salary-payment.component.html",
  styleUrls: ["./confirm-salary-payment.component.scss"]
})
export class ConfirmSalaryPaymentComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;

  companyBalance: string = "0";
  noOfEmployees: string = "0";
  monthSelected: string = "";
  totalAmount: number = 0;

  constructor(
    private companyReducer: CompanyReducers,
    private router: Router,
    private _dataStore: DataStore
  ) {}

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isConfirmLoading = true;

    const state = this._dataStore.dataStore$.getValue();

    this.companyReducer.cardReducer({
      type: EMPLOYEE_ADD_ALLOWANCE,
      payload: {
        company: state.company_id,
        deposit: state.allowance.pay.employees
      }
    });
    setTimeout(() => {
      this.isVisible = false;
      this.isConfirmLoading = false;
      this.router.navigate(["/salary", "salarypaymentresponse"]);
      this.router;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnInit() {
    const state = this._dataStore.dataStore$.getValue();
    this.companyBalance = _.get(state.company.details, "data.value", 0);
    this.monthSelected = state.allowance.pay.month;

    this.totalAmount = this.getTotalAmount();
    this.noOfEmployees = state.allowance.pay.employees.length;
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
