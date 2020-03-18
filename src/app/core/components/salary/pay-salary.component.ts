import { Component, OnInit, Inject } from "@angular/core";
import { environment } from "@env/environment";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import { DataStore } from "@app/core/store/app.store";
import { GET_EMPLOYEES } from "@app/core/store/actions";
import * as _ from "lodash";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";

interface Employees {
  _id: number;
  name: string;
  designation: string;
  department: string;
  accountno: number;
  salaryamount: number;
  email: string;
}

interface BulkDeposit {
  email: string;
  amount: number;
  amount_type: string;
}

@Component({
  selector: "koppr-pot",
  templateUrl: "./pay-salary.component.html",
  styleUrls: ["./pay-salary.component.scss"]
})
export class PaySalaryComponent implements OnInit {
  amount: number = 1;
  checked = true;
  selectedValue = "January";
  selectedAllowance = "expense";
  selectedSort = "Sort";
  searchText = "";
  employeeDetails: Employees[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  bulkDepositPost: BulkDeposit[] = [];
  noOfSelection: number = 0;
  companyBalance: string = "0";
  initialState: any = "";
  totalAmount: number = 0;
  globalAmount: number = 0;
  constructor(
    private er: EmployeeReducers,
    private _dataStore: DataStore,
    private router: Router,
    @Inject(DOCUMENT) document
  ) {
    this.initialState = this._dataStore.dataStore$.getValue();
  }

  ngOnInit() {
    this.er.cardReducer({
      type: GET_EMPLOYEES,
      payload: {
        company: this.initialState.company_id
      }
    });

    this._dataStore.dataStore$.subscribe(data => {
      if (_.get(data.employees.details, "data", null)) {
        this.employeeDetails = _.get(data.employees.details, "data", []);
      }
    });

    this.setSelectionCount();

    this.showCompanyBalance();
  }

  showCompanyBalance(): void {
    this.companyBalance = _.get(
      this.initialState.company.details,
      "data.value",
      0
    );
  }

  setSelectionCount(): void {
    this.noOfSelection = 0;
    this.totalAmount = 0;
    this.employeeDetails.forEach(res => {
      if (this.mapOfCheckedId[res._id]) {
        this.noOfSelection++;

        this.totalAmount = this.totalAmount + this.getValueFromInput(res._id);
      }
    });
  }

  setGlobalAmount(): void {
    this.employeeDetails.forEach(res => {
      this.setValueFromInput(this.globalAmount);
    });
    this.setSelectionCount();
  }

  refreshStatus(data): void {
    this.setSelectionCount();
  }
  checkAll(value: boolean): void {
    this.employeeDetails.forEach(
      item => (this.mapOfCheckedId[item._id] = value)
    );
    this.setSelectionCount();
  }

  getValueFromInput(id: any): number {
    let e = "amount" + id;
    let element: any = document.getElementById(e);

    if (element.value == "") {
      element.value = 0;
    }

    return parseInt(element.value);
  }

  setValueFromInput(id: any): void {
    let e = "amount" + id;
    let element: any = document.getElementById(e);

    element.value = this.globalAmount;
  }

  public continuePayAllowance() {
    const state = this._dataStore.dataStore$.getValue();

    this.employeeDetails.forEach(res => {
      if (this.mapOfCheckedId[res._id]) {
        this.bulkDepositPost.push({
          email: res.email,
          amount: this.getValueFromInput(res._id),
          amount_type: this.selectedAllowance
        });
      }
    });

    this._dataStore.dataStore$.next({
      ...state,
      ...catchCommonData,
      allowance: {
        pay: {
          employees: this.bulkDepositPost,
          month: this.selectedValue
        }
      }
    });

    this.router.navigate(["/", "salary", "confirmsalarypayment"]);
  }
}
