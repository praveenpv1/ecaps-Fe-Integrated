import { Component, OnInit, Injectable } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import {
  GET_EMPLOYEES,
  SEND_VERIFICATION,
  USERS_LIST
} from "@app/core/store/actions";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { Router } from "@angular/router";
import { isThisMonth } from "date-fns";
import { mockData } from "@app/core/services/mock.service";
import { UserReducers } from "@app/core/store/reducers/user.reducer";

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
  selector: "app-super-distributor",
  templateUrl: "./super-distributor.component.html",
  styleUrls: ["./super-distributor.component.scss"]
})
export class SuperDistributorComponent implements OnInit {
  employeesList: any;
  selectedValue = "Sort";
  searchText = "";
  initialState: any = "";
  constructor(
    private er: EmployeeReducers,
    private ds: DataStore,
    private route: Router,
    private user: UserReducers
  ) {
    this.initialState = ds.dataStore$.getValue();
  }

  ngOnInit() {
    // this.er.cardReducer({
    //   type: GET_EMPLOYEES,
    //   payload: {
    //     company: `${this.initialState.company_id}`
    //   }
    // });

    this.user.userReducer({
      type: USERS_LIST,
      payload: {
        id: _.get(this.initialState, "userInfo._id", null),
        childName: "childrenList"
      }
    });

    console.log("Children", this.initialState.childrenList);

    this.employeesList = mockData.distirbutorList;

    // this.ds.dataStore$.subscribe(data => {
    //   let employeeResponse = _.get(data.employees.details, "data", null);
    //   if (employeeResponse) {
    //     this.employeesList = _.get(data.employees.details, "data", []);
    //   }

    //   // data.employee.details.array.forEach(element => {
    //   //   this.employeesList.push({
    //   //     id: element._id,
    //   //     name: element.firstName + " " + element.lastName,
    //   //     designation: "Adminstrator",
    //   //     department: "IT"
    //   //   });
    //   // });
    // });
  }
  // editRoute(data: any): void {
  //   if (data._id) {
  //     this.route.navigate(["/", "employee", "add", data.user._id, data._id]);
  //   }
  // }
  // resendVerification(data: any): void {
  //   if (data._id) {
  //     this.er.cardReducer({
  //       type: SEND_VERIFICATION,
  //       payload: {
  //         employee_id: data._id
  //       }
  //     });
  //   }
  // }
}
