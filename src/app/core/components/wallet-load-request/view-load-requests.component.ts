import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";
// import { DataStore } from "@app/core/store/app.store";
import { ActivatedRoute, Router } from "@angular/router";
// import {
//   USER_EXTRA_DETAILS,
//   GET_FUND_LOADS,
//   APPROVE_FUND_LOADS,
// } from "@app/core/store/actions";
// import { FundReducers } from "@app/core/store/reducers/fund.reducer";
// import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { Store } from "@ngxs/store";
import {
  ApproveFundLoadRequestAction,
  GetFundLoadRequestsListAction,
} from "@app/core/ngxs-store/ngxs-actions/funds.actions";

@Component({
  selector: "app-view-load-requests",
  templateUrl: "./view-load-requests.component.html",
  styleUrls: ["./view-load-requests.component.scss"],
})
export class ViewLoadRequestsComponent implements OnInit {
  loadRequestDetails: any;
  requestId: string = "";
  // initialState: any = "";
  // userId: any = "";

  constructor(
    // private ds: DataStore,
    // private fR: FundReducers,
    // private user: UserReducers,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private router: Router
  ) {
    // this.initialState = ds.dataStore$.getValue();
    // this.userId = _.get(this.initialState, "userInfo._id", null);
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this.requestId = this.activatedRoute.snapshot.paramMap.get("id");
    }

    if (!_.isEmpty(this.requestId)) {
      // this.fR.fundReducer({
      //   type: GET_FUND_LOADS,
      //   payload: { id: this.userId },
      // });
      // this.ds.dataStore$.subscribe((data) => {
      //   if(data.fundLoadRequests){
      //     let loadRequests = data.fundLoadRequests
      //     this.loadRequestDetails = _.filter(loadRequests, ['_id', this.requestId])[0]
      //   }
      // });

      this.store.dispatch(new GetFundLoadRequestsListAction());
      this.store.subscribe(({ fundState }) => {
        if (fundState.fundLoadRequests) {
          let loadRequests = fundState.fundLoadRequests;
          this.loadRequestDetails = _.filter(loadRequests, [
            "_id",
            this.requestId,
          ])[0];
        }
      });
    } else {
      this.router.navigate(["/wallet-load-request"]);
    }
  }

  approveLoadRequest() {
    // this.fR.fundReducer({
    //   type: APPROVE_FUND_LOADS,
    //   payload: { requestId: this.loadRequestDetails._id, userId: this.userId },
    // });
    // this.user.userReducer({ type: USER_EXTRA_DETAILS });
    this.store.dispatch(
      new ApproveFundLoadRequestAction(this.loadRequestDetails._id)
    );
  }
  rejectLoadRequest() {
    alert("rejected");
  }
}
