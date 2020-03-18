import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import {
  GET_COMPANY_WALLET,
  GET_COMPANY_MAIN_TXNS,
  GET_COMPANY_TXNS,
  GET_CLAIMS_TXNS
} from "@app/core/store/actions";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { SalaryIn, getStatusText } from "@app/core/services/utils";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";
import { CurrencyPipe } from "@angular/common";
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
  text: string;
  icon: string;
  bgClass?: string;
  desc: string;
  routerLink: any;
  type: InfoType;
  iconImg?: string;
}

@Component({
  selector: "koppr-pot",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  companyBalance: string = "0";
  balanceCards: InfoCards[] = [];
  mockCards: InfoCards[] = [];

  pendingClaims = 0;
  approvedClaims = 0;
  settledClaims = 0;

  claimsData: any;
  pendingClaimsData: any;
  approvedClaimsData: any;
  settledClaimsData: any;

  infoCards: InfoCards[] = [];
  recentTransaction: RecentTransactions[] = [];
  companyTranscations: any;
  initialState: any = "";
  expenseData: any = [];
  allowanceData: any;
  subscribers: any = [];
  constructor(
    private cR: CompanyReducers,
    private ds: DataStore,
    private currencyPipe: CurrencyPipe
  ) {
    this.initialState = ds.dataStore$.getValue();
    this.clearCompanyTxnsStore();
    this.clearClaimsStore();

    this.subscribers = this.ds.dataStore$.subscribe(res => {
      console.log(res);

      if (_.get(res.company.details, "data", null)) {
        this.companyBalance = _.get(res.company.details, "data.value", 0);
      }

      if (_.get(res.company_transactions.details, "data", null)) {
        this.companyTranscations = res.company_transactions.details.data;
      }

      if (_.get(res.company_txns.details, "data", null)) {
        this.expenseData = _.filter(res.company_txns.details.data, function(
          txns
        ) {
          return txns.amount_type === "expense";
        });

        this.allowanceData = _.filter(res.company_txns.details.data);
        this.clearCompanyTxnsStore();
        this.getClaims();
      }

      if (_.get(res.claims_txns.details, "data", null)) {
        this.claimsData = res.claims_txns.details.data;
        this.settledClaimsData = _.filter(this.claimsData, function(claims) {
          if (claims.approval_status === "approved") {
            return true;
          }
        });
        this.settledClaims = this.getSettledClaimAmount(this.settledClaimsData);

        this.pendingClaimsData = _.filter(this.claimsData, function(claims) {
          return claims.approval_status === "pending_approval";
        });
        this.pendingClaims = this.pendingClaimsData.length;

        this.renderCards();
        this.clearClaimsStore();
      }
    });
  }

  getSettledClaimAmount(data: any): number {
    let amount = 0;
    data.forEach(element => {
      amount = amount + element.amount;
    });
    return amount;
  }

  public showCompanyWallet() {
    this.cR.cardReducer({
      type: GET_COMPANY_WALLET,
      payload: {}
    });
  }

  ngOnInit() {
    this.showCompanyWallet();

    this.getCompanyTransactions();
    this.getCompanyTxns();
    //this.getClaims();
  }

  ngOnDestroy() {
    this.subscribers.unsubscribe();
  }

  getCompanyTxns() {
    this.cR.cardReducer({
      type: GET_COMPANY_TXNS,
      payload: {}
    });
  }

  getClaims() {
    this.cR.cardReducer({
      type: GET_CLAIMS_TXNS,
      payload: {}
    });
  }

  getCompanyTransactions() {
    this.cR.cardReducer({
      type: GET_COMPANY_MAIN_TXNS,
      payload: { company: this.initialState.company_id }
    });
  }

  getStatusText(status: string): string {
    return getStatusText(status);
  }

  getTotalSalary(amounts: any): string {
    let totalSalary = 0;
    amounts.forEach(element => {
      totalSalary = totalSalary + element.amount;
    });
    return totalSalary.toString();
  }

  clearCompanyTxnsStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      company_txns: {
        details: {}
      }
    });
  }

  clearClaimsStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      claims_txns: {
        details: {}
      }
    });
  }

  renderCards(): void {
    this.balanceCards = [];
    this.infoCards = [];
    this.balanceCards.push(
      {
        title: "Enviar Account Balance",
        text: this.currencyPipe.transform(this.companyBalance, "₹"),
        icon: "more",

        bgClass: "enviar-account-balance",
        desc: "TOP UP",
        routerLink: ["/", "company", "deposit"],
        type: InfoType.amount
      },
      {
        title: "Money Transferred",
        text: this.currencyPipe.transform(
          this.getTotalSalary(this.expenseData),
          "₹"
        ),
        icon: "more",
        bgClass: "white-gradient-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "salary"],
        type: InfoType.amount
      },
      {
        title: "Earnings",
        text: this.currencyPipe.transform(this.settledClaims, "₹"),
        icon: "more",
        bgClass: "white-gradient-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "claims"],
        type: InfoType.amount
      },
      {
        title: "Ledgers",
        text: this.currencyPipe.transform(
          this.getTotalSalary(this.allowanceData),
          "₹"
        ),
        icon: "more",
        bgClass: "white-gradient-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "allowance"],
        type: InfoType.amount
      }
    );

    this.infoCards = [
      {
        title: "Auto Wallet Loading in",
        text: SalaryIn(),
        icon: "more",
        bgClass: "white-gradient-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "salary"],
        type: InfoType.info,
        iconImg: "assets/images/calendar.svg"
      },
      {
        title: "Pending Transactions",
        text: this.pendingClaims + "Txns",
        icon: "more",
        bgClass: "white-gradient-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "claims"],
        type: InfoType.info,
        iconImg: "assets/images/re-imbursement.svg"
      }
    ];
  }
}
