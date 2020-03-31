import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  LOADING,
  CREATE_COMPANY_SIGNUP,
  EMPLOYEE_ADD_ALLOWANCE,
  GET_COMPANY_WALLET,
  EMPLOYEE_CREATE,
  GET_COMPANY_TXNS,
  GET_COMPANY_MAIN_TXNS,
  GET_COMPANIES,
  COMPANY_DEPOSIT,
  SHOW_MODAL,
  GET_TOKEN,
  UPDATE_COMPANY_TXNS,
  GET_CLAIMS_TXNS,
  GET_COMPANY_BY_ID,
  UPDATE_COMPANY,
  APPROVE_COMPANY_TXNS,
  NOT_LOADING,
  GET_COMPANY_TOP_UP_TXNS,
  UPDATE_COMPANY_TXNS_CLAIMREVIEW
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { environment } from "@env/environment";
import { EmployeeReducers } from "./employee.reducer";
import { ModalReducers } from "./modal.reducer";
import { $ } from "protractor";

@Injectable()
export class CompanyReducers {
  companyApi: string = MODEL_PATHS.companies;
  companyAllowanceBulkAdd: string = MODEL_PATHS.comp_emp_txns_bulk;
  companyTXNS: string = MODEL_PATHS.comp_emp_txns;
  company_transactions: string = MODEL_PATHS.company_transactions;
  employees: string = MODEL_PATHS.employees;
  routerLink: any = "";
  routerType: any = "";
  first_name: string = "";
  last_name: string = "";
  gender: string = "";
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private router: Router,
    private toast: ToastReducers,
    private eR: EmployeeReducers,
    private modalReducer: ModalReducers
  ) {}

  cardReducer(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case CREATE_COMPANY_SIGNUP:
        console.log("CREATE COMPANY SIGN UP");
        this._loader.loadingState({ type: LOADING });

        //user check
        this.apiService
          .pk_get(
            this.employees + "/search?email=" + action.payload.email,
            "",
            {}
          )
          .then(res => {
            let employeeResults: any = res;
            if (employeeResults.length > 0) {
              //alert("Already Exists");
              this.toast.commonCatchToast("Email Already exists");
            } else {
              this.apiService
                .pk_get(
                  this.employees +
                    "/search?mobile=" +
                    encodeURIComponent(action.payload.mobile),
                  "",
                  {}
                )
                .then(res => {
                  let employeeResults: any = res;
                  if (employeeResults.length > 0) {
                    //alert("Already Exists");
                    this.toast.commonCatchToast("Phone Already exists");
                  } else {
                    this.apiService
                      .pk_post(this.companyApi, {
                        ...action.payload
                      })
                      .then(data => {
                        if (action.payload.first_name) {
                          this.first_name = action.payload.first_name;
                          delete action.payload["first_name"];
                        }

                        if (action.payload.last_name) {
                          this.last_name = action.payload.last_name;
                          delete action.payload["last_name"];
                        }

                        if (action.payload.routerLink) {
                          this.routerLink = action.payload.routerLink;
                          delete action.payload["routerLink"];
                        }

                        if (action.payload.routerType) {
                          this.routerType = action.payload.routerType;
                          delete action.payload["routerType"];
                        }

                        if (action.payload.gender) {
                          this.gender = action.payload.gender;
                          delete action.payload["gender"];
                        }

                        this._dataStore.dataStore$.next({
                          ...state,
                          ...successCommonData,
                          card: {
                            ...state.card
                          }
                        });

                        this.eR.cardReducer({
                          type: EMPLOYEE_CREATE,
                          payload: {
                            first_name: this.first_name,
                            last_name: this.last_name,
                            email: action.payload.email,
                            mobile: action.payload.mobile,
                            company: data["_id"],
                            isCompanyAdmin: true,
                            gender: this.gender,
                            routerLink: this.routerLink,
                            routerType: this.routerType
                          }
                        });

                        this.routerLink = "";
                        this.routerType = "";
                      })
                      .catch(error => {
                        this.toast.commonCatchToast(error.response.data.error);
                      });
                  }
                });
            }
          });

        break;
      case UPDATE_COMPANY:
        console.log("UPDATE_COMPANY");
        this._loader.loadingState({ type: LOADING });

        //user check

        this.apiService
          .put(`${this.companyApi}/${action.payload.company_id}`, "", {
            ...action.payload
          })
          .then(data => {
            if (action.payload.first_name) {
              this.first_name = action.payload.first_name;
              delete action.payload["first_name"];
            }

            if (action.payload.last_name) {
              this.last_name = action.payload.last_name;
              delete action.payload["last_name"];
            }

            if (action.payload.routerLink) {
              this.routerLink = action.payload.routerLink;
              delete action.payload["routerLink"];
            }

            if (action.payload.routerType) {
              this.routerType = action.payload.routerType;
              delete action.payload["routerType"];
            }

            if (action.payload.gender) {
              this.gender = action.payload.gender;
              delete action.payload["gender"];
            }

            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              card: {
                ...state.card
              }
            });

            this.modalReducer.cardReducer({
              type: SHOW_MODAL,
              payload: {
                showModal: true,
                title: "Info",
                message: "Account settings updated",
                routerLink: ["/", "dashboard"]
              }
            });

            this.routerLink = "";
            this.routerType = "";
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });

        break;
      case EMPLOYEE_ADD_ALLOWANCE:
        console.log("ADD EMPLOYEE ALLOWANCE");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_post(this.companyAllowanceBulkAdd, {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });
        break;
      case COMPANY_DEPOSIT:
        console.log("COMPANY_DEPOSIT");
        this._loader.loadingState({ type: LOADING });

        this.routerLink = ["/", "dashboard"];

        if (action.payload.routerLink) {
          this.routerLink = action.payload.routerLink;
          delete action.payload["routerLink"];
        }

        this.apiService
          .pk_post(this.company_transactions, {
            ...action.payload
          })
          .then(data => {
            const transcationData: any = data;
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              transcationAddResponse: {
                details: { data }
              }
            });

            this.routerLink = "";
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });
        break;
      case GET_COMPANY_WALLET:
        console.log("IN GET_CARD_DETAILS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(`${this.companyApi}/${state.company_id}/wallet`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              company: {
                ...state.card,
                details: { data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case GET_COMPANIES:
        console.log("IN GET_COMPANIES");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(`${this.companyApi}`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              companies: {
                details: { data: data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case GET_COMPANY_BY_ID:
        console.log("IN GET_COMPANIES_BY_ID");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(`${this.companyApi}/${action.payload.company_id}`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              company_info: {
                details: { data: data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case GET_TOKEN:
        console.log("GET TOKEN");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .mutation(
            `superadmin`,
            "longTermToken",
            {
              ...action.payload
            },
            "success, token",
            false,
            ""
          )
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              token: {
                data: data
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case UPDATE_COMPANY_TXNS:
        console.log("UPDATE_COMPANY_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .put(`${this.companyTXNS}/${action.payload.txnid}`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              claims_update_data: {
                details: { data }
              }
            });

            this._loader.loadingState({ type: NOT_LOADING });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case UPDATE_COMPANY_TXNS_CLAIMREVIEW:
        console.log("UPDATE_COMPANY_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .put(`${this.companyTXNS}/claimReview/${action.payload.txnid}`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              claims_update_data: {
                details: { data }
              }
            });

            this._loader.loadingState({ type: NOT_LOADING });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case APPROVE_COMPANY_TXNS:
        console.log("APPROVE_COMPANY_TXNS");
        this._loader.loadingState({ type: LOADING });
        let txnid = action.payload.txnid;
        if (action.payload.txnid) {
          delete action.payload["txnid"];
        }
        this.apiService
          .put(`${this.company_transactions}/${txnid}`, "", {
            ...action.payload
          })
          .then(data => {
            this._loader.loadingState({ type: NOT_LOADING });
            this._dataStore.dataStore$.next({
              ...state,
              company_txn_approved: {
                details: { data }
              }
            });
          })
          .catch(error => {
            this._loader.loadingState({ type: NOT_LOADING });

            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case GET_COMPANY_TXNS:
        console.log("IN GET_COMPANY_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(`${this.companyTXNS}`, "", {
            ...action.payload
          })
          .then(data => {
            let state = this._dataStore.dataStore$.getValue();
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              company_txns: {
                details: { data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;
      case GET_CLAIMS_TXNS:
        console.log("IN GET_CLAIMS_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(
            `${this.companyTXNS}?txn_type=reimbursement&txn_type=cash_reimbursement`,
            "",
            {
              ...action.payload
            }
          )
          .then(data => {
            let state = this._dataStore.dataStore$.getValue();
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              claims_txns: {
                details: { data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;
      case GET_COMPANY_MAIN_TXNS:
        console.log("IN GET_COMPANY_MAIN_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(`${this.company_transactions}`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              company_transactions: {
                details: { data: data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;

      case GET_COMPANY_TOP_UP_TXNS:
        console.log("IN GET_COMPANY_MAIN_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(`${this.company_transactions}`, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              topUpTranscations: {
                details: { data: data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });
        break;
      default:
        console.log("IN COMPANY DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
  public checkCardStatus(data: Object) {
    return _.get(data, "cardStatusList[0]", "UNLOCKED") === "LOCKED";
  }
}
