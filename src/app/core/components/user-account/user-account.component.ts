import { Component, OnInit } from '@angular/core';
import * as _ from "lodash";
import { DataStore } from "@app/core/store/app.store";

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit {
  userDetails: any; 

  constructor(
    private ds: DataStore,
  ) { }

  ngOnInit() {
    this.ds.dataStore$.subscribe((data) => {
      this.userDetails = data.userExtraDetails
    });
  }
}