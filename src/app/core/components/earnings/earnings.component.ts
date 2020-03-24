import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import { DataStore } from "@app/core/store/app.store";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Label } from "ng2-charts";
import { barGraphOptions } from "@app/core/services/graphoptions";
import {
    GET_COMPANY_WALLET,
    GET_COMPANY_TXNS,
    GET_EMPLOYEES
} from "@app/core/store/actions";
import * as _ from "lodash";
import {
    catchCommonData,
    successCommonData
} from "@app/core/store/commonstoredata";
import { SalaryIn } from "@app/core/services/utils";
import * as moment from "moment";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";

export interface Tile {
    color: string;
    cols: number;
    rows: number;
    text: string;
    category: string;
    route: string;
    icon: string;
}

interface SalaryPayment {
    paidOn: Date;
    amount: string;
    month: string;
    employeesPaid: number;
    paidBy: string;
    id: number;
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
    selector: "app-earnings",
    templateUrl: "./earnings.component.html",
    styleUrls: ["./earnings.component.scss"]
})
export class EarningsComponent implements OnInit, OnDestroy {
    dateFormat = "yyyy/MM/dd";
    monthFormat = "yyyy/MM";
    public barGraphOptions = barGraphOptions;
    salaryPayment: SalaryPayment[] = [];
    txnsData: any = [];
    companyBalance: string = "0";
    balanceCards: InfoCards[] = [];
    validateForm: FormGroup;

  submitForm(): void {
    console.log(this.validateForm.value);
  }
    public subscribers: any = {};

    infoCards: InfoCards[] = [
        {
            title: "Next Salary Disbursement in",
            text: SalaryIn(),
            icon: "more",
            bgClass: "",
            desc: "VIEW DETAILS",
            routerLink: ["/", "salary"],
            type: InfoType.info,
            iconImg: "assets/images/calendar.svg"
        }
    ];
    public barChartLabels: Label[] = [];
    public barChartType: ChartType = "bar";
    public barChartLegend = true;
    public barChartPlugins = [pluginDataLabels];

    public barChartData: ChartDataSets[] = [{ data: [] }];
    employees: any;
    constructor(
        private cR: CompanyReducers,
        private ds: DataStore,
        private eR: EmployeeReducers,
        private fb: FormBuilder
    ) {
        this.subscribers = this.ds.dataStore$.subscribe(res => {
            console.log(res);

            if (_.get(res.company.details, "data", null)) {
                this.companyBalance = _.get(
                    res.company.details,
                    "data.value",
                    0
                );
            }

            if (_.get(res.employees.details, "data", null)) {
                this.employees = _.get(res.employees.details, "data", []);
                this.clearEmployeeStore();

                // this.cR.cardReducer({
                //     type: GET_COMPANY_TXNS,
                //     payload: {}
                // });
            }

            this.balanceCards = [];
            this.renderCards();

            if (_.get(res.company_txns.details, "data", null)) {
                this.txnsData = _.filter(
                    res.company_txns.details.data,
                    function(txns) {
                        return txns.amount_type === "expense";
                    }
                );

                this.groupByDate(this.txnsData);
            }
        });
    }
    // public showCompanyWallet() {
    //     this.cR.cardReducer({
    //         type: GET_COMPANY_WALLET,
    //         payload: {}
    //     });
    // }

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

    getEmployeeEmail(id: any): void {
        let employeeDetail = _.filter(this.employees, { _id: id });

        if (employeeDetail.length > 0) {
            return employeeDetail[0].email;
        } else {
            return id;
        }
    }
    ngOnInit() {
        this.validateForm = this.fb.group({
            startDate: [null],
            endDate: [null]
          });
        // this.showCompanyWallet();
        //get all employees
        // this.eR.cardReducer({
        //   type: GET_EMPLOYEES,
        //   payload: {}
        // });
        // this.cR.cardReducer({
        //   type: GET_COMPANY_TXNS,
        //   payload: {}
        // });
    }
    groupByDate(txnData: any): void {
        this.barChartLabels = [];
        this.barChartData[0].data = [];

        let dateGroup: any = _.orderBy(txnData, ["initiated_ts"], ["asc"]);

        dateGroup = _.groupBy(dateGroup, function(data) {
            return moment(data.initiated_ts * 1000)
                .startOf("month")
                .format("MMMM");
        });

        let amountArray = _.keys(dateGroup).map(date => {
            return { [date]: _.sumBy(dateGroup[date], "amount") };
        });

        amountArray.forEach(element => {
            this.barChartLabels.push(_.keys(element));
            // this.barChartData[0].data.push(element[_.keys(element)]);
        });
    }

    renderCards(): void {
        this.balanceCards.push({
            title: "Enviar Account Balance",
            text: this.companyBalance,
            icon: "more",
            bgClass: "enviar-account-balance",
            desc: "TOP UP",
            routerLink: ["/", "company", "deposit"],
            type: InfoType.amount
        });
    }
    cleaTxnStore(): void {
        const state = this.ds.dataStore$.getValue();
        this.ds.dataStore$.next({
            ...state,
            ...successCommonData,
            company_txns: {
                details: {}
            }
        });
    }
    ngOnDestroy() {
        this.cleaTxnStore();
        this.subscribers.unsubscribe();
    }
    public chartClicked({
        event,
        active
    }: {
        event: MouseEvent;
        active: {}[];
    }): void {
        console.log(event, active);
    }

    public chartHovered({
        event,
        active
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
            40
        ];
        this.barChartData[0].data = data;
    }
}
