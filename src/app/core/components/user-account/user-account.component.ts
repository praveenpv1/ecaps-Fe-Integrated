import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import { DataStore } from "@app/core/store/app.store";
import { USER_EXTRA_DETAILS } from "@app/core/store/actions";
import { UserReducers } from "@app/core/store/reducers/user.reducer";


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
  userDetails: any; 

  constructor(
    private ds: DataStore,
    private user: UserReducers
  ) { }

  ngOnInit() {
    this.user.userReducer({ type: USER_EXTRA_DETAILS });
    this.ds.dataStore$.subscribe((data) => {
      this.userDetails = data.userExtraDetails
    });
  }
}