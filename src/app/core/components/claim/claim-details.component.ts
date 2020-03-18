import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { EmployeeReducers } from "@app/core/store/reducers/employee.reducer";
import { MerchantReducers } from "@app/core/store/reducers/merchant.reducer";
import {
  GET_COMPANY_EMPLOYEE_TXNS,
  GET_REIMBURSEMENT_MERCHANT_TXNS,
  GET_EMPLOYEE,
  UPDATE_COMPANY_TXNS,
  UPDATE_COMPANY_TXNS_CLAIMREVIEW
} from "@app/core/store/actions";
import { DataStore } from "@app/core/store/app.store";
import * as _ from "lodash";
import { DatePipe } from "@angular/common";
import {
  catchCommonData,
  successCommonData
} from "@app/core/store/commonstoredata";
import { SalaryIn, getStatusText, STATUS } from "@app/core/services/utils";
import { CompanyReducers } from "@app/core/store/reducers/company.reducer";
import { STATUS_CODES } from "http";

@Component({
  selector: "koppr-claim",
  templateUrl: "./claim-details.component.html",
  styleUrls: ["./claim-details.component.scss"]
})
export class ClaimDetailsComponent implements OnInit, OnDestroy {
  txnsDetails: any = [];
  merchantTxnsDetails: any = [];
  employeeDetails: any = [];
  reimbursement_txn_id: any = "";
  employee_id: any = "";
  txnType: any = "";
  isVisible = false;
  isConfirmLoading = false;
  rejectclaimreason: string;
  _id: string = "";
  listOfData = [1];
  subscribers: any = {};
  typeOfAction: string = "";
  reasonText: string = "";
  claimStatus: string = "";
  amountToSettle: number = 0;
  comments: any = [];
  constructor(
    private er: EmployeeReducers,
    private mr: MerchantReducers,
    private activatedRoute: ActivatedRoute,
    private ds: DataStore,
    private datePipe: DatePipe,
    private cR: CompanyReducers
  ) {
    this.subscribers = this.ds.dataStore$.subscribe(res => {
      this.txnsDetails = _.get(res.claim_details.details, "data", null);

      if (this.txnsDetails) {
        this.reimbursement_txn_id = this.txnsDetails.reimbursement_txn_id;
        this.employee_id = this.txnsDetails.employee;
        this.txnType = this.txnsDetails.txn_type;
        this.claimStatus = this.txnsDetails.approval_status;
        this.amountToSettle = this.txnsDetails.amount;
        this.comments = this.txnsDetails.comments;
        this.clearClaimDetailStore();
        this.mr.merchantReducer({
          type: GET_REIMBURSEMENT_MERCHANT_TXNS,
          payload: {
            id: this.reimbursement_txn_id
          }
        });
        this.er.cardReducer({
          type: GET_EMPLOYEE,
          payload: {
            id: this.employee_id
          }
        });
      }

      if (_.get(res.reimbursement_merchant_txns.details, "data", null)) {
        this.merchantTxnsDetails = _.get(
          res.reimbursement_merchant_txns.details,
          "data",
          []
        );
        /*clear store*/
        this.clearMerchantTxnsStore();
      }
      if (_.get(res.singleEmployee.details, "data", null)) {
        this.employeeDetails = _.get(res.singleEmployee.details, "data", []);
        /*clear store*/
        this.clearEmployeeTxnsStore();
      }

      if (_.get(res.claims_update_data.details, "data", null)) {
        this.clearUpdateClaimsTxnsStore();

        this.getClaimsDetails();
      }

      console.log(res);
    });
  }
  ngOnDestroy(): void {
    this.subscribers.unsubscribe();
  }

  isClaimStatusPending(): boolean {
    return this.claimStatus === STATUS.PENDING_APPROVAL;
  }

  clearClaimDetailStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      claim_details: {
        details: {}
      }
    });
  }
  getStatusText(status: string): string {
    return getStatusText(status);
  }
  clearEmployeeTxnsStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      singleEmployee: {
        details: {}
      }
    });
  }

  clearUpdateClaimsTxnsStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      claims_update_data: {
        details: {}
      }
    });
  }

  clearMerchantTxnsStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      ...successCommonData,
      reimbursement_merchant_txns: {
        details: {}
      }
    });
  }

  showModal(status: string): void {
    this.setActionType(status);
    this.isVisible = true;
  }

  handleOk(id: string): void {
    this.isConfirmLoading = true;

    if (this.typeOfAction == "Approve") {
      this.updateClaims(id, STATUS.COMPANY_APPROVED, this.reasonText);
    } else if (this.typeOfAction == "Settle") {
      this.updateClaims(id, STATUS.INTERNALLY_APPROVED, this.reasonText);
    } else if (this.typeOfAction == "Reject") {
      this.updateClaims(id, STATUS.REJECT, this.reasonText);
    }

    this.isVisible = false;
    this.isConfirmLoading = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get("id")) {
      this._id = this.activatedRoute.snapshot.paramMap.get("id");
      console.log(this._id);
    }

    this.getClaimsDetails();
  }

  getClaimsDetails(): void {
    this.er.cardReducer({
      type: GET_COMPANY_EMPLOYEE_TXNS,
      payload: {
        id: this._id
      }
    });
  }

  setActionType(status: string): void {
    this.typeOfAction = status;
  }
  updateClaims(id: string, status: string, comment: string): void {
    if (this.typeOfAction == "Settle") {
      this.cR.cardReducer({
        type: UPDATE_COMPANY_TXNS,
        payload: {
          txnid: id,
          approval_status: status,
          amount: this.amountToSettle,
          comment: comment
        }
      });
    } else if (
      this.typeOfAction == "Approve" ||
      this.typeOfAction == "Reject"
    ) {
      this.cR.cardReducer({
        type: UPDATE_COMPANY_TXNS_CLAIMREVIEW,
        payload: {
          txnid: id,
          approval_status: status,
          amount: this.amountToSettle,
          comment: comment
        }
      });
    }
  }
}
