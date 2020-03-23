import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import {
  GET_COMPANY_TXNS,
  GET_COMPANY_WALLET,
  UPDATE_COMPANY_TXNS,
  GET_CLAIMS_TXNS,
  GET_EMPLOYEES
} from "@app/core/store/actions";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";
import { getStatusText } from "@app/core/services/utils";

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
  info = 2
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
  selector: "koppr-claim",
  templateUrl: "./claim.component.html",
  styleUrls: ["./claim.component.scss"]
})
export class ClaimComponent implements OnInit, OnDestroy {
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
  mockCards: InfoCards[] = [];
  claimsData: any;
  pendingClaimsData: any;
  rejectedClaimsData: any;
  settledClaimsData: any = [];
  employees: any;
  constructor(
    private cR: CompanyReducers,
    private ds: DataStore,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private eR: EmployeeReducers
  ) {
    this.subscribers = this.ds.dataStore$.subscribe(res => {
      this.companyBalance = _.get(res.company.details, "data.value", 0);
      this.balanceCards = [];

      if (_.get(res.employees.details, "data", null)) {
        this.employees = _.get(res.employees.details, "data", []);
        this.clearEmployeeStore();

        this.cR.cardReducer({
          type: GET_COMPANY_TXNS,
          payload: {}
        });
      }

      if (_.get(res.company_transactions.details, "data", null)) {
        this.companyTranscations = res.company_transactions.details.data;
      }

      if (_.get(res.claims_txns.details, "data", null)) {
        this.claimsData = res.claims_txns.details.data;

        this.pendingClaimsData = _.filter(this.claimsData, function(claims) {
          return claims.approval_status === "pending_approval";
        });
        this.pendingClaims = this.pendingClaimsData.length;

        this.rejectedClaimsData = _.filter(this.claimsData, function(claims) {
          return claims.approval_status === "company_disapproved";
        });
        this.rejectedClaims = this.rejectedClaimsData.length;

        this.settledClaimsData = _.filter(this.claimsData, function(claims) {
          if (
            claims.approval_status === "approved" ||
            claims.approval_status === "pending_kit_sync"
          ) {
            //if (this.settledClaims)
            //this.settledClaims = this.settledClaims + claims.amount;
            return true;
          }
        });
        this.approvedCounts = this.settledClaimsData.length;
        this.settledClaims = this.getSettledClaimAmount(this.settledClaimsData);
      }

      this.renderCards();
    });
  }
  public showCompanyWallet() {
    this.cR.cardReducer({
      type: GET_COMPANY_WALLET,
      payload: {}
    });
  }

  getSettledClaimAmount(data: any): number {
    let amount = 0;
    data.forEach(element => {
      amount = amount + element.amount;
    });
    return amount;
  }

  getEmployeeEmail(id: any): void {
    let employeeDetail = _.filter(this.employees, { _id: id });

    if (employeeDetail.length > 0) {
      return employeeDetail[0].email;
    } else {
      return id;
    }
  }

  ngOnDestroy() {
    this.subscribers.unsubscribe();
  }
  clearEmployeeStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      employees: {
        details: {}
      }
    });
  }
  ngOnInit() {
    this.showCompanyWallet();

    //get all employees
    this.eR.cardReducer({
      type: GET_EMPLOYEES,
      payload: {}
    });

    this.cR.cardReducer({
      type: GET_CLAIMS_TXNS,
      payload: {}
    });
  }
  renderCards(): void {
    this.balanceCards = [];
    this.mockCards = [
      {
        title: "Pending Claims",
        text: this.pendingClaims + " claims",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "claims"],
        type: InfoType.info,
        showDetail: false
      },
      {
        title: "Approved Claims",
        text: this.approvedCounts + " claims",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "claims"],
        type: InfoType.info,
        showDetail: false
      },
      {
        title: "Claims Settled",
        text: this.currencyPipe.transform(this.settledClaims, "₹"),
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "claims"],
        type: InfoType.amount,
        showDetail: false
      }
    ];

    this.balanceCards.push(...this.mockCards, {
      title: "Enviar Account Balance",
      text: this.currencyPipe.transform(this.companyBalance, "₹"),
      icon: "more",
      bgClass: "enviar-account-balance",
      desc: "TOP UP",
      routerLink: ["/", "company", "deposit"],
      type: InfoType.amount,
      showDetail: true
    });
  }

  getStatusText(status: string): string {
    return getStatusText(status);
  }
  approveClaims(id: string): void {
    this.cR.cardReducer({
      type: UPDATE_COMPANY_TXNS,
      payload: { txnid: id, approval_status: "internally_approved" }
    });
  }

  rejectClaims(id: string): void {
    this.cR.cardReducer({
      type: UPDATE_COMPANY_TXNS,
      payload: { txnid: id, approval_status: "disapproved" }
    });
  }
}
