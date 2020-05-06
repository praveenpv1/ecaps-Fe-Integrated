import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { DataStore } from "@app/core/store/app.store";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import {
  GET_COMPANY_WALLET,
  GET_COMPANY_MAIN_TXNS,
  GET_COMPANY_TXNS,
  GET_CLAIMS_TXNS,
  USER_EXTRA_DETAILS,
  GET_WALLET_TRANSACTION_LIST,
  DASHBOARD_COMBINED_APIS,
} from "@app/core/store/actions";
import * as _ from "lodash";
import { environment } from "@env/environment";
import { SalaryIn, getStatusText } from "@app/core/services/utils";
import {
  catchCommonData,
  successCommonData,
} from "@app/core/store/commonstoredata";
import { CurrencyPipe } from "@angular/common";
import { barGraphOptions } from "@app/core/services/graphoptions";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Label } from "ng2-charts";
import { TransactionReducers } from "@app/core/store/reducers/transaction.reducer";
import { DashboardReducers } from "@app/core/store/reducers/dashboard.reducer";

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
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  companyBalance: string = "0";
  balanceCards: InfoCards[] = [];
  mockCards: InfoCards[] = [];

  moneyTransfered: number = 0;
  userBalance: number = 0;

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
  initialState: any = {};
  expenseData: any = [];
  allowanceData: any;
  subscribers: any = [];
  public barGraphOptions = barGraphOptions;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // Use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  public barChartLabels: Label[] = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
  ];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Series A" },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  constructor(
    private cR: CompanyReducers,
    private ds: DataStore,
    private currencyPipe: CurrencyPipe,
    private uR: UserReducers,
    private tR: TransactionReducers,
    private dashboard: DashboardReducers
  ) {
    this.initialState = ds.dataStore$.getValue();
    this.clearCompanyTxnsStore();
    this.clearClaimsStore();

    // this.subscribers = this.ds.dataStore$.subscribe((res) => {
    //   console.log(res);

    //   if (_.get(res.company.details, "data", null)) {
    //     this.companyBalance = _.get(res.company.details, "data.value", 0);
    //   }

    //   if (_.get(res.company_transactions.details, "data", null)) {
    //     this.companyTranscations = res.company_transactions.details.data;
    //   }

    //   if (_.get(res.company_txns.details, "data", null)) {
    //     this.expenseData = _.filter(res.company_txns.details.data, function (
    //       txns
    //     ) {
    //       return txns.amount_type === "expense";
    //     });

    //     this.allowanceData = _.filter(res.company_txns.details.data);
    //     this.clearCompanyTxnsStore();
    //     this.getClaims();
    //   }

    //   if (_.get(res.claims_txns.details, "data", null)) {
    //     this.claimsData = res.claims_txns.details.data;
    //     this.settledClaimsData = _.filter(this.claimsData, function (claims) {
    //       if (claims.approval_status === "approved") {
    //         return true;
    //       }
    //     });
    //     // this.settledClaims = this.getSettledClaimAmount(this.settledClaimsData);

    //     this.pendingClaimsData = _.filter(this.claimsData, function (claims) {
    //       return claims.approval_status === "pending_approval";
    //     });
    //     this.pendingClaims = this.pendingClaimsData.length;
    //     this.clearClaimsStore();
    //   }
    // });
  }

  // getSettledClaimAmount(data: any): number {
  //   let amount = 0;
  //   data.forEach((element) => {
  //     amount = amount + element.amount;
  //   });
  //   return amount;
  // }

  // public showCompanyWallet() {
  //   this.cR.cardReducer({
  //     type: GET_COMPANY_WALLET,
  //     payload: {},
  //   });
  // }

  ngOnInit() {
    // this.uR.userReducer({
    //   type: USER_EXTRA_DETAILS,
    //   payload: { id: this.initialState.userInfo._id },
    // });

    // this.tR.transactionReducer({ type: GET_WALLET_TRANSACTION_LIST });

    this.dashboard.dashboardReducer({ type: DASHBOARD_COMBINED_APIS });

    // this.showCompanyWallet();
    // this.getCompanyTransactions();
    // this.getCompanyTxns();
    //this.getClaims();
    this.subscribers = this.ds.dataStore$.subscribe((data) => {
      const transactions = _.get(
        data.userWalletTransactionList,
        "transaction_recs",
        []
      );
      this.moneyTransfered = _.sumBy(transactions, "trn_amount");

      console.log(data.userExtraDetails);

      this.userBalance = _.get(data.userExtraDetails, "wallet_balance", 0);

      this.renderCards();
    });
  }

  ngOnDestroy() {
    // this.subscribers.unsubscribe();
  }

  getCompanyTxns() {
    this.cR.cardReducer({
      type: GET_COMPANY_TXNS,
      payload: {},
    });
  }

  getClaims() {
    this.cR.cardReducer({
      type: GET_CLAIMS_TXNS,
      payload: {},
    });
  }

  getCompanyTransactions() {
    this.cR.cardReducer({
      type: GET_COMPANY_MAIN_TXNS,
      payload: { company: this.initialState.company_id },
    });
  }

  getStatusText(status: string): string {
    return getStatusText(status);
  }

  getTotalSalary(amounts: any): string {
    let totalSalary = 0;
    amounts.forEach((element) => {
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
        details: {},
      },
    });
  }

  clearClaimsStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      claims_txns: {
        details: {},
      },
    });
  }

  public chartClicked({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.random() * 100,
      56,
      Math.random() * 100,
      40,
    ];
    this.barChartData[0].data = data;
  }

  renderCards(): void {
    this.balanceCards = [];
    this.infoCards = [];
    this.balanceCards.push(
      {
        title: "Enviar Account Balance",
        text: `${this.userBalance}`,
        icon: "more",

        bgClass: "enviar-account-balance",
        desc: "TOP UP",
        // routerLink: ["/", "company", "deposit"],
        routerLink: null,
        type: InfoType.amount,
      },
      {
        title: "Money Transferred",
        text: `${this.moneyTransfered}`,
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: ["/", "transactions"],
        type: InfoType.amount,
      },
      {
        title: "Earnings",
        text: "99",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        // routerLink: ["/", "claims"],
        routerLink: null,
        type: InfoType.amount,
      },
      {
        title: "Ledgers",
        text: "9",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: null,
        // routerLink: ["/", "allowance"],
        type: InfoType.amount,
      }
    );

    this.infoCards = [
      {
        title: "Auto Wallet Loading in",
        text: "9 Days",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: null,
        // routerLink: ["/", "salary"],
        type: InfoType.info,
        iconImg: "assets/images/calendar.svg",
      },
      {
        title: "Pending Transactions",
        text: "99 Txns",
        icon: "more",
        bgClass: "white-bg-card",
        desc: "VIEW DETAILS",
        routerLink: null,
        // routerLink: ["/", "claims"],
        type: InfoType.info,
        iconImg: "assets/images/re-imbursement.svg",
      },
    ];
  }
}
