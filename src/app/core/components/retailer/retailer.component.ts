import { Component, OnInit, Injectable } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import {
  GET_EMPLOYEES,
  SEND_VERIFICATION,
  CHILD_USERS_LIST,
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
  info = 2,
}

interface Employees {
  id: number;
  name: string;
  designation: string;
  department: string;
}

@Component({
  selector: "app-retailer",
  templateUrl: "./retailer.component.html",
  styleUrls: ["./retailer.component.scss"],
})
export class RetailerComponent implements OnInit {
  retailorsList: any;
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
      type: CHILD_USERS_LIST,
      payload: {
        id: _.get(this.initialState, "userInfo._id", null),
        childName: "childrenList",
      },
    });

    this.ds.dataStore$.subscribe((data) => {
      this.retailorsList = data.childrenList.filter(
        (child: any) => child.role === "retailer"
      );
    });
  }
  editRoute(data: any): void {
    if (data._id) {
      this.route.navigate(["/", "retailer", "add", data._id]);
    }
  }
}
