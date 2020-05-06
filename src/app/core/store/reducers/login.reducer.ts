import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  ADD_USER_INFO,
  LOADING,
  NOT_LOADING,
  LOGIN,
  FETCH_USER_GRAPHQL,
  RESET_STATE,
  FORGOT_PASSWORD,
  SHOW_TOAST,
  VERIFY_EMAIL,
  SET_PASSWORD,
  CHILD_USERS_LIST,
  USER_EXTRA_DETAILS,
  GET_WALLET_TRANSACTION_LIST,
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { AuthService } from "auth";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";
import { UserReducers } from "./user.reducer";
import { TransactionReducers } from "./transaction.reducer";

@Injectable()
export class LoginReducers {
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private authService: AuthService,
    private router: Router,
    private toast: ToastReducers,
    private resetReducer: ResetStateReducers,
    private user: UserReducers,
    private transaction: TransactionReducers
  ) {}

  loginReducer(action: any) {
    let state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case LOGIN:
        this._loader.loadingState({ type: LOADING });

        console.log("IN USER LOGIN");

        let defaultRedirectURL = ["dashboard"];

        //clear state
        this.resetReducer.resetState({
          type: RESET_STATE,
          payload: {},
        });

        state = this._dataStore.dataStore$.getValue();
        this.apiService.login(action.payload).subscribe(
          ({ data }: any) => {
            this.authService.setAccessToken(data.token);
            if (data.is_verified) {
              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
                userInfo: _.omit(data, "token"),
              });
              localStorage.setItem("userData", JSON.stringify(data));
              // this.user.userReducer({
              //   type: USER_EXTRA_DETAILS,
              //   payload: { id: data._id },
              // });
              // this.transaction.transactionReducer({
              //   type: GET_WALLET_TRANSACTION_LIST,
              // });

              this.router.navigate(["/", ...defaultRedirectURL]);

              // this.user.userReducer({
              //   type: CHILD_USERS_LIST,
              //   payload: {
              //     id: _.get(data, "_id", null),
              //     childName: "childrenList"
              //   }
              // });
            } else {
              this.toast.commonCatchToast("Not Verified");
              this.router.navigate(["/sigin"]);
            }
            console.log(data);
          },
          (error) => {
            this.toast.commonCatchToast(
              _.get(error, "message", "Something Went Wrong!!")
            );
          }
        );
        break;

      case FORGOT_PASSWORD:
        this._loader.loadingState({ type: LOADING });

        console.log("IN FORGOT_PASSWORD");

        state = this._dataStore.dataStore$.getValue();

        this.apiService
          .get(`main/auth/forgot-password/${action.payload.email}`, {}, false)
          .subscribe(
            (response: any) => {
              if (_.get(response, "status", 500) === 200) {
                this.toast.toastState({
                  type: SHOW_TOAST,
                  payload: { message: response.message, type: "success" },
                });

                this._dataStore.dataStore$.next({
                  ...state,
                  ...successCommonData,
                });
                this.router.navigate(["/sigin"]);
              } else {
                this.toast.commonCatchToast(
                  _.get(response, "message", "Something Went Wrong!!")
                );
              }
            },
            (error) => {
              this.toast.commonCatchToast(
                _.get(error, "message", "Something Went Wrong!!")
              );
            }
          );
        break;

      case VERIFY_EMAIL:
        this._loader.loadingState({ type: LOADING });

        console.log("IN VERIFY_EMAIL");

        state = this._dataStore.dataStore$.getValue();

        this.apiService
          .verifyEmail(`main/auth/verify/${action.payload.token}`)
          .subscribe(
            (response: any) => {
              console.log("responsee", response);

              this.toast.toastState({
                type: SHOW_TOAST,
                payload: { message: response.message, type: "success" },
              });

              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
              });
              this.router.navigate(["/sigin"]);
            },
            (error) => {
              console.log("error", error);

              this.toast.commonCatchToast(
                _.get(error, "message", "Something Went Wrong!!")
              );
            }
          );
        break;

      case SET_PASSWORD:
        this._loader.loadingState({ type: LOADING });

        console.log("IN VERIFY_EMAIL");

        state = this._dataStore.dataStore$.getValue();

        this.apiService
          .post(`main/auth/verify/${action.payload.token}`, {
            newpassword: action.payload.password,
          })
          .subscribe(
            (response: any) => {
              this.toast.toastState({
                type: SHOW_TOAST,
                payload: { message: response.message, type: "success" },
              });

              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
              });
              this.router.navigate(["/sigin"]);
            },
            (error) => {
              this.toast.commonCatchToast(
                _.get(error, "message", "Something Went Wrong!!")
              );
            }
          );
        break;

      default:
        console.log("IN LOGIN DEFAULT");
        this._dataStore.dataStore$.next({
          ...state,
        });
    }
  }
}
