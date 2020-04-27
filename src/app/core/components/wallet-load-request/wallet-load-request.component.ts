import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import { FundReducers } from "@app/core/store/reducers/fund.reducer";
import {
  GET_COMPANY_TXNS,
  GET_COMPANY_WALLET,
  UPDATE_COMPANY_TXNS,
  GET_CLAIMS_TXNS,
  GET_EMPLOYEES,
  GET_FUND_LOADS,
  APPROVE_FUND_LOADS,
} from "@app/core/store/actions";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import {
  catchCommonData,
  successCommonData,
} from "@app/core/store/commonstoredata";
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
interface RecentTransactions {
  id: number;
  date: Date;
  details: string;
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
  selectedValue = "Sort";
  searchText = "";
  companyBalance: string = "0";
  tabs = ["All", "Pending", "Approved", "Rejected"];
  recentTransaction: RecentTransactions[] = [];
  public subscribers: any = {};
  pendingClaims = 0;
  rejectedClaims = 0;
  settledClaims: any = 0;
  approvedCounts: any = 0;
  companyTranscations: any;
  balanceCards: InfoCards[] = []; 
  claimsData: any;
  pendingClaimsData: any;
  rejectedClaimsData: any;
  settledClaimsData: any = [];
  employees: any;
  walletLoadRequests: any = [];
  initialState: any = "";
  userId: any = "";
  constructor(
    private cR: CompanyReducers,
    private ds: DataStore,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private eR: EmployeeReducers,
    private fR: FundReducers
  ) {
    this.initialState = ds.dataStore$.getValue();
    this.userId = _.get(this.initialState, "userInfo._id", null);
    // this.subscribers = this.ds.dataStore$.subscribe((res) => {
    //   this.companyBalance = _.get(res.company.details, "data.value", 0);
    //   this.balanceCards = [];

    //   if (_.get(res.employees.details, "data", null)) {
    //     this.employees = _.get(res.employees.details, "data", []);
    //     this.clearEmployeeStore();

    //     // this.cR.cardReducer({
    //     //   type: GET_COMPANY_TXNS,
    //     //   payload: {}
    //     // });
    //   }

    //   if (_.get(res.company_transactions.details, "data", null)) {
    //     this.companyTranscations = res.company_transactions.details.data;
    //   }

    //   if (_.get(res.claims_txns.details, "data", null)) {
    //     this.claimsData = res.claims_txns.details.data;

    //     this.pendingClaimsData = _.filter(this.claimsData, function (claims) {
    //       return claims.approval_status === "pending_approval";
    //     });
    //     this.pendingClaims = this.pendingClaimsData.length;

    //     this.rejectedClaimsData = _.filter(this.claimsData, function (claims) {
    //       return claims.approval_status === "company_disapproved";
    //     });
    //     this.rejectedClaims = this.rejectedClaimsData.length;

    //     this.settledClaimsData = _.filter(this.claimsData, function (claims) {
    //       if (
    //         claims.approval_status === "approved" ||
    //         claims.approval_status === "pending_kit_sync"
    //       ) {
    //         //if (this.settledClaims)
    //         //this.settledClaims = this.settledClaims + claims.amount;
    //         return true;
    //       }
    //     });
    //     this.approvedCounts = this.settledClaimsData.length;
    //     this.settledClaims = this.getSettledClaimAmount(this.settledClaimsData);
    //   }

    //   this.renderCards();
    // });
  }
  //   public showCompanyWallet() {
  // this.cR.cardReducer({
  //   type: GET_COMPANY_WALLET,
  //   payload: {}
  // });
  //   }

  //   getSettledClaimAmount(data: any): number {
  //     let amount = 0;
  //     data.forEach((element) => {
  //       amount = amount + element.amount;
  //     });
  //     return amount;
  //   }

  //   getEmployeeEmail(id: any): void {
  //     let employeeDetail = _.filter(this.employees, { _id: id });

  //     if (employeeDetail.length > 0) {
  //       return employeeDetail[0].email;
  //     } else {
  //       return id;
  //     }
  //   }

  ngOnDestroy() {
    this.subscribers.unsubscribe();
  }
  //   clearEmployeeStore(): void {
  //     const state = this.ds.dataStore$.getValue();
  //     this.ds.dataStore$.next({
  //       ...state,
  //       ...successCommonData,
  //       employees: {
  //         details: {},
  //       },
  //     });
  //   }
  ngOnInit() {
    // this.showCompanyWallet();

    this.fR.fundReducer({
      type: GET_FUND_LOADS,
      payload: { id: this.userId },
    });
    this.subscribers = this.ds.dataStore$.subscribe((data) => {
      if (data.fundLoadRequests) {
        this.walletLoadRequests = data.fundLoadRequests;
      }
      this.renderCards();
    });
  }
  renderCards(): void { 
    this.balanceCards = [
      {
        title: "Pending Requests",
        text: "0 requests",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "wallet-load-request"],
        type: InfoType.info,
        showDetail: false,
      },
      {
        title: "Approved Requests",
        text: "0 requests",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "wallet-load-request"],
        type: InfoType.info,
        showDetail: false,
      },
      {
        title: "Requests Settled",
        text: "₹",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "wallet-load-request"],
        type: InfoType.amount,
        showDetail: false,
      },
      {
        title: "Enviar Account Balance",
        text: "₹",
        icon: "more",
        bgClass: "enviar-account-balance",
        desc: "TOP UP",
        routerLink: ["/", "wallet-top-up"],
        type: InfoType.amount,
        showDetail: true,
        }
    ]; 
  }

  //   getStatusText(status: string): string {
  //     return getStatusText(status);
  //   }

  //   approveClaims(id: string): void {
  // this.cR.cardReducer({
  //   type: UPDATE_COMPANY_TXNS,
  //   payload: { txnid: id, approval_status: "internally_approved" }
  // });
  //   }

  //   rejectClaims(id: string): void {
  // this.cR.cardReducer({
  //   type: UPDATE_COMPANY_TXNS,
  //   payload: { txnid: id, approval_status: "disapproved" }
  // });
  //   }
  approveLoadRequest(data) {
    console.log(data);
    this.fR.fundReducer({
      type: APPROVE_FUND_LOADS,
      payload: { requestId: data._id, userId: this.userId },
    });
  }
}
