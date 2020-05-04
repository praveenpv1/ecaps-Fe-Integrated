import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class DataStore {
  public dataStore$: BehaviorSubject<any>;

  public initialState: Object = {
    userInfo: JSON.parse(localStorage.getItem("userData")),
    userExtraDetails: JSON.parse(localStorage.getItem("userExtraData")),
    superDistributorList: {},
    distributorList: {},
    retailerList: {},
    childUser: {},
    childrenList: [],
    fundLoadRequests: [],
    userWalletTransactionList: [],
    marginList: [],
    loader: false,
    loadingMessage: "",
    toast: false,
    toastType: "error",
    toastMessage: "",
    isSuccess: false,
    card: {
      assignCard: {},
      cardDetails: {},
      isLocked: false,
    },
    modal: {
      title: "",
      icon: "",
      message: "",
      closeButtonText: "",
      submitButtonText: "",
      submitAction: {},
      showModal: false,
    },
    createEmployee: {
      details: {},
    },
    editEmployee: {
      details: {},
    },
    company: {
      details: {},
    },
    company_id: sessionStorage.getItem("company_id"),
    allowance: {
      pay: {
        allowanceSelected: "",
        employees: [],
      },
    },
    singleEmployee: {
      detail: {},
    },
    company_txns: {
      details: {},
    },
    claims_txns: {
      details: {},
    },
    company_transactions: {
      details: {},
    },
    companies: {
      details: {},
    },
    roles: sessionStorage.getItem("roles"),
    token: {},
    claim_details: {
      details: {},
    },
    merchant_txns: {
      details: {},
    },
    reimbursement_merchant_txns: {
      details: {},
    },
    bulkImport: {
      details: {},
    },
    company_info: {
      details: {},
    },
    transcationAddResponse: {
      details: {},
    },
    employees: {
      details: {},
    },
    topUpTranscations: {
      details: {},
    },
    claims_update_data: {
      details: {},
    },
    ca_token: {
      details: {},
    },
    company_txn_approved: {
      detail: {},
    },
  };

  constructor() {
    this.dataStore$ = new BehaviorSubject(this.initialState);
  }
}
