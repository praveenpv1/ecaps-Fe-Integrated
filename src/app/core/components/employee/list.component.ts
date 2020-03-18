import { Component, OnInit, Injectable } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { GET_EMPLOYEES, SEND_VERIFICATION } from "@app/core/store/actions";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { Router } from "@angular/router";
import { isThisMonth } from "date-fns";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  category: string;
  route: string;
  icon: string;
}

enum InfoType {
  amount = 1,
  info = 2
}

interface Employees {
  id: number;
  name: string;
  designation: string;
  department: string;
}

@Component({
  selector: "koppr-pot",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"]
})
export class ListComponent implements OnInit {
  employeesList: Employees[] = [];
  selectedValue = "Sort";
  searchText = "";
  initialState: any = "";
  constructor(
    private er: EmployeeReducers,
    private ds: DataStore,
    private route: Router
  ) {
    this.initialState = ds.dataStore$.getValue();
  }

  ngOnInit() {
    this.er.cardReducer({
      type: GET_EMPLOYEES,
      payload: {
        company: `${this.initialState.company_id}`
      }
    });

    this.ds.dataStore$.subscribe(data => {
      let employeeResponse = _.get(data.employees.details, "data", null);
      if (employeeResponse) {
        this.employeesList = _.get(data.employees.details, "data", []);
      }

      // data.employee.details.array.forEach(element => {
      //   this.employeesList.push({
      //     id: element._id,
      //     name: element.firstName + " " + element.lastName,
      //     designation: "Adminstrator",
      //     department: "IT"
      //   });
      // });
    });
  }
  editRoute(data: any): void {
    if (data._id) {
      this.route.navigate(["/", "employee", "add", data.user._id, data._id]);
    }
  }
  resendVerification(data: any): void {
    if (data._id) {
      this.er.cardReducer({
        type: SEND_VERIFICATION,
        payload: {
          employee_id: data._id
        }
      });
    }
  }
}
