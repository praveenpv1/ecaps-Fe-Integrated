import { Component, OnInit, Injectable } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import {
  GET_EMPLOYEES,
  SEND_VERIFICATION,
  GET_COMPANY_MAIN_TXNS,
  GET_COMPANIES
} from "@app/core/store/actions";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { Router } from "@angular/router";
import { isThisMonth } from "date-fns";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";

@Component({
  selector: "koppr-pot",
  templateUrl: "./companylist.component.html",
  styleUrls: ["./companylist.component.scss"]
})
export class CompanyListComponent implements OnInit {
  companiesList: any = [];
  selectedValue = "Sort";
  searchText = "";
  initialState: any = "";
  constructor(
    private cr: CompanyReducers,
    private ds: DataStore,
    private route: Router,
    private eR: EmployeeReducers
  ) {
    this.initialState = ds.dataStore$.getValue();
  }

  ngOnInit() {
    this.cr.cardReducer({
      type: GET_COMPANIES,
      payload: {}
    });

    this.ds.dataStore$.subscribe(data => {
      if (_.get(data, "companies.details.data", null)) {
        this.companiesList = _.get(data, "companies.details.data", []);
      }
    });
  }
  resendVerification(data: any): void {
    this.eR.cardReducer({
      type: SEND_VERIFICATION,
      payload: {
        employee_id: data._id
      }
    });
  }
}
