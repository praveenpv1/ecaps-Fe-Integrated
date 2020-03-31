import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  ADD_USER_INFO,
  LOADING,
  NOT_LOADING,
  ASSIGN_CARD,
  GET_CARD_DETAILS,
  LOCK_UNLOCK_CARD,
  SET_PIN,
  CREATE_COMPANY_SIGNUP,
  GET_EMPLOYEES,
  EMPLOYEE_CREATE,
  SHOW_MODAL,
  FETCH_USER_GRAPHQL,
  CREATE_EMPLOYEE_CONTACT,
  SEND_VERIFICATION,
  GET_EMPLOYEE,
  GET_COMPANY_EMPLOYEE_TXNS,
  EMPLOYEE_CREATE_BULK,
  CATEGORY_BULK,
  GET_CA_TOKEN,
  HIDE_MODAL
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { ModalReducers } from "./modal.reducer";
import { NzMessageService } from "ng-zorro-antd/message";

@Injectable()
export class EmployeeReducers {
  apiPath: string = MODEL_PATHS.employees;
  companyAllowanceBulkAdd: string = MODEL_PATHS.comp_emp_txns_bulk;
  EmployeeTXNS: string = MODEL_PATHS.comp_emp_txns;
  company_transactions: string = MODEL_PATHS.company_transactions;
  routerLink: any = "";
  errorBulk: any = [];
  importBulk: any = [];
  employeeLength: any = 0;

  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private router: Router,
    private toast: ToastReducers,
    private modalReducer: ModalReducers,
    private message: NzMessageService
  ) {}

  cardReducer(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case GET_EMPLOYEES:
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_get(this.apiPath, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              employees: {
                details: { data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });
        break;

      case GET_EMPLOYEE:
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_get(this.apiPath + "/" + action.payload.id, "", {})
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              singleEmployee: {
                details: { data: data }
              }
            });
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });
        break;

      case GET_COMPANY_EMPLOYEE_TXNS:
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_get(this.EmployeeTXNS + "/" + action.payload.id, "", {})
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              claim_details: {
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

      case EMPLOYEE_CREATE:
        console.log("CREATE EMPLOYEE PERSONAL DETAILS");
        this.routerLink = ["/", "employee", "list"];
        let routerType = "";
        if (action.payload.routerLink) {
          this.routerLink = action.payload.routerLink;
          delete action.payload["routerLink"];
        }

        if (action.payload.routerType) {
          routerType = action.payload.routerType;
          delete action.payload["routerType"];
        }
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_post(this.apiPath, {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              createEmployee: {
                ...state.createEmployee,
                details: data
              }
            });

            const employeeId = _.get(data, "_id", null);
            if (employeeId) {
              this.cardReducer({
                type: SEND_VERIFICATION,
                payload: {
                  employee_id: employeeId
                }
              });

              if (routerType == "redirect") {
                this.router.navigate(this.routerLink);
              } else {
                this.modalReducer.cardReducer({
                  type: SHOW_MODAL,
                  payload: {
                    showModal: true,
                    title: "Info",
                    message: "Added sucessfully",
                    routerLink: this.routerLink
                  }
                });
              }
            }
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });
        break;

      case CATEGORY_BULK:
        action.payload.forEach(res => {
          this.apiService
            .mutation(
              `transactions`,
              "update_category",
              {
                mcc: parseInt(res["mcc"]),
                category: res["category"],
                description: res["description"]
              },
              "success",
              false,
              ""
            )
            .then(data => {})
            .catch(error => {
              this.toast.commonCatchToast(
                _.get(error.response, "data.error", "Something Went Wrong!")
              );
            });
        });
        break;
      case EMPLOYEE_CREATE_BULK:
        this.errorBulk = [];
        this.importBulk = [];
        console.log("CREATE EMPLOYEE BULK IMPORT");
        this.routerLink = ["/", "employee", "list"];
        if (action.payload.routerLink) {
          this.routerLink = action.payload.routerLink;
          delete action.payload["routerLink"];
        }
        this._loader.loadingState({ type: LOADING });

        this.employeeLength = 0;

        action.payload.forEach(res => {
          this.apiService
            .pk_post(this.apiPath, {
              first_name: res["First name (required)"],
              last_name: res["Last name (required)"],
              gender: res["Gender (required)"]
                ? res["Gender (required)"].toLowerCase()
                : "",
              email: res["Email (required)"],
              mobile: "+91" + res["Mobile (required)"]
            })
            .then(data => {
              let res: any = data;
              this.employeeLength++;
              let employeeData: any = data;
              this.importBulk.push({
                id: res._id,
                email: employeeData.email,
                details: "success"
              });

              if (this.employeeLength == action.payload.length) {
                state.loader = true;
                this._dataStore.dataStore$.next({
                  ...state,
                  bulkImport: {
                    details: { success: this.importBulk, error: this.errorBulk }
                  }
                });
                this.employeeLength = 0;
                this.emailSent(this.importBulk);
              }

              console.log(this.importBulk);
              console.log(this.errorBulk);
            })
            .catch(error => {
              this.employeeLength++;
              this.errorBulk.push({
                email: res["Email (required)"],
                phone: "+91" + res["Mobile (required)"],
                details: error.response.data.error
              });
              if (this.employeeLength == action.payload.length) {
                //this._loader.loadingState({ type: NOT_LOADING });
                state.loader = true;
                this._dataStore.dataStore$.next({
                  ...state,
                  bulkImport: {
                    details: { success: this.importBulk, error: this.errorBulk }
                  }
                });
                this.employeeLength = 0;
                this.emailSent(this.importBulk);
              }

              console.log(this.importBulk);
              console.log(this.errorBulk);
            });
        });

        break;
      case SEND_VERIFICATION:
        console.log("SEND VERIFICATION");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_post(
            `${this.apiPath}/${action.payload.employee_id}/resend_otp_email`,
            {}
          )
          .then(r => {
            this._loader.loadingState({ type: NOT_LOADING });
          })
          .catch(error => {
            this.toast.commonCatchToast(error.response.data.error);
          });
        break;
      case GET_CA_TOKEN:
        console.log("IN GET_CLAIMS_TXNS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(
            "/v1/companies/" + action.payload.company_id + "/admin",
            "",
            {}
          )
          .then(data => {
            let userData: any = data;

            if (userData.error) {
              this.toast.commonCatchToast(
                _.get(userData.error, "data.error", userData.error)
              );
              this._loader.loadingState({ type: NOT_LOADING });
              return false;
            }

            this.apiService
              .pk_get("/v1/" + userData.entityId + "/authenticate", "", {})
              .then(data => {
                let userToken: any = data;
                this.apiService
                  .pk_get(
                    this.company_transactions + "?token=" + userToken.token,
                    "",
                    {}
                  )
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
                    this._loader.loadingState({ type: NOT_LOADING });

                    this.toast.commonCatchToast(
                      _.get(
                        error.response,
                        "data.error",
                        "Something Went Wrong!"
                      )
                    );
                  });
              })
              .catch(error => {
                this._loader.loadingState({ type: NOT_LOADING });

                this.toast.commonCatchToast(
                  _.get(error.response, "data.error", "Something Went Wrong!")
                );
              });
          })
          .catch(error => {
            this._loader.loadingState({ type: NOT_LOADING });

            this.toast.commonCatchToast(
              _.get(error.response, "data.error", "Something Went Wrong!")
            );
          });

        break;
      case FETCH_USER_GRAPHQL:
        console.log("Fetch user profile");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .query(
            `employee-profile`,
            "fetch_employee_data",
            action.payload,
            "name, kit_no,last_digits,special_date,address_1,address_2,city, state,pincode,id_type,id_number, gender,employee_id, title,country, country_of_issue, kyc_status",
            false,
            "pot.createData"
          )
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              editEmployee: {
                details: data
              }
            });
          })
          .catch(error => {
            // this.toast.commonCatchToast(
            //   _.get(error.response, "data.error", "Something Went Wrong!")
            // );
          });
        break;

      case CREATE_EMPLOYEE_CONTACT:
        console.log("IN CREATE CONTACT INFO");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .mutation(
            `employee-profile`,
            "add_employee_data",
            {
              ...action.payload
            },
            "name, kit_no, last_digits, special_date,address_1, address_2, city, state , pincode, id_type, id_number, gender, employee_id, title, country, country_of_issue, kyc_status",
            false,
            ""
          )
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              editEmployee: {
                details: data
              }
            });

            this.modalReducer.cardReducer({
              type: SHOW_MODAL,
              payload: {
                showModal: true,
                title: "Info",
                message: "Update successful",
                routerLink: ["/", "employee", "list"]
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

  public emailSent(obj: any): any {
    let totalCount = obj.length;
    let counter = 0;
    let messageId = "";
    let messageText =
      "We are sending emails to your employees, kindly do not close this page.";

    if (totalCount > 0) {
      messageId = this.message.loading(messageText, {
        nzDuration: 0
      }).messageId;
    } else {
      this._loader.loadingState({ type: NOT_LOADING });
    }
    obj.forEach(element => {
      this.apiService
        .pk_post(`${this.apiPath}/${element.id}/resend_otp_email`, {})
        .then(r => {
          counter++;

          if (counter == totalCount) {
            this.message.remove(messageId);
            this._loader.loadingState({ type: NOT_LOADING });
          }
        })
        .catch(error => {
          this._loader.loadingState({ type: NOT_LOADING });
          this.message.remove(messageId);
        });
    });
  }

  public checkCardStatus(data: Object) {
    return _.get(data, "cardStatusList[0]", "UNLOCKED") === "LOCKED";
  }
}
