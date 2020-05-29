import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
// import { DataStore } from "@app/core/store/app.store";
// import { USER_EXTRA_DETAILS } from "@app/core/store/actions";
// import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { Store } from "@ngxs/store";
import { GetUserExtraDetailsAction } from "@app/core/ngxs-store/ngxs-actions/user.actions";

@Component({
  selector: "app-user-account",
  templateUrl: "./user-account.component.html",
  styleUrls: ["./user-account.component.scss"],
})
export class UserAccountComponent implements OnInit {
  userDetails: any;

  constructor(
    // private ds: DataStore,
    // private user: UserReducers,
    private store: Store
  ) {}

  ngOnInit() {
    // this.user.userReducer({ type: USER_EXTRA_DETAILS });

    // this.ds.dataStore$.subscribe((data) => {
    //   this.userDetails = data.userExtraDetails
    // });

    this.store.dispatch(new GetUserExtraDetailsAction());
    this.store.subscribe(({ userState }) => {
      this.userDetails = userState.userExtraDetails;
    });
  }
}
