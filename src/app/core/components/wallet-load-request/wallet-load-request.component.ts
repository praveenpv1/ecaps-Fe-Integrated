import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { FundReducers } from "@app/core/store/reducers/fund.reducer";
import { 
  GET_FUND_LOADS,
  APPROVE_FUND_LOADS,
  USER_EXTRA_DETAILS,
} from "@app/core/store/actions";
import * as _ from "lodash";
import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { Router } from "@angular/router";
// import { getStatusText } from "@app/core/services/utils";

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

interface InfoCards {
  title: string;
  text: any;
  icon: string;
  bgClass?: string;
  desc: string;
  routerLink: any;
  type: InfoType;
  iconImg?: string;
  showDetail?: boolean;
}
@Component({
  selector: "app-wallet-load-request",
  templateUrl: "./wallet-load-request.component.html",
  styleUrls: ["./wallet-load-request.component.scss"],
})
export class WalletLoadRequestComponent implements OnInit, OnDestroy {
  requestDataStatus: any = {};
  pendingFundLoadRequests: number = 0;
  approvedFundLoadRequests: number = 0;
  selectedValue = "Sort";
  searchText = "";
  public subscribers: any = {};  
  balanceCards: InfoCards[] = [];  
  walletLoadRequests: any = [];
  initialState: any = "";
  userId: any = "";

  constructor(
    private ds: DataStore,
    private fR: FundReducers,
    private user: UserReducers,
    private router: Router
  ) {
    this.initialState = ds.dataStore$.getValue();
    this.userId = _.get(this.initialState, "userInfo._id", null);
  }
  
  ngOnDestroy() {
    this.subscribers.unsubscribe();
  } 

  ngOnInit() {

    this.fR.fundReducer({
      type: GET_FUND_LOADS,
      payload: { id: this.userId },
    });
    this.subscribers = this.ds.dataStore$.subscribe((data) => {
      if (data.fundLoadRequests) {
        this.walletLoadRequests = _.reverse(data.fundLoadRequests);
        this.requestDataStatus = _.groupBy(
          this.walletLoadRequests,
          "fl_status"
        );
        console.log("requestDataStatus", this.requestDataStatus);
        if (!_.isEmpty(this.requestDataStatus)) {
          this.pendingFundLoadRequests = _.get(
            this.requestDataStatus,
            "true.length",
            0
          );
          this.approvedFundLoadRequests = _.get(
            this.requestDataStatus,
            "false.length",
            0
          );
        }
      }
      this.renderCards();
    });
  }
  renderCards(): void {
    this.balanceCards = [
      {
        title: "Pending Requests",
        text: `${this.pendingFundLoadRequests} requests`,
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "wallet-load-request"],
        type: InfoType.info,
        showDetail: false,
      },
      {
        title: "Approved Requests",
        text: `${this.approvedFundLoadRequests} requests`,
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "wallet-load-request"],
        type: InfoType.info,
        showDetail: false,
      },
      {
        title: "Requests Settled",
        text: `${_.sumBy(
          _.get(this.requestDataStatus, "false", {}),
          "fl_req_amount"
        )}`,
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "wallet-load-request"],
        type: InfoType.amount,
        showDetail: false,
      },
      // {
      //   title: "Enviar Account Balance",
      //   text: "₹",
      //   icon: "more",
      //   bgClass: "enviar-account-balance",
      //   desc: "TOP UP",
      //   routerLink: ["/", "wallet-top-up"],
      //   type: InfoType.amount,
      //   showDetail: true,
      //   }
    ];
  }
  viewLoadRequestRoute(data){
    if(data._id){
      this.router.navigate(["/", "view-load-request", data._id]);
    }
  }
}
