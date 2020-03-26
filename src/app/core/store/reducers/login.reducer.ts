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
  SHOW_TOAST
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { AuthService } from "auth";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";

@Injectable()
export class LoginReducers {
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private authService: AuthService,
    private router: Router,
    private toast: ToastReducers,
    private resetReducer: ResetStateReducers
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
          payload: {}
        });

        state = this._dataStore.dataStore$.getValue();
        this.apiService.login(action.payload).subscribe(
          (response: any) => {
            this.authService.setAccessToken(response.token);
            if (response.is_verified) {
              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
                userInfo: _.omit(response, "token")
              });
              localStorage.setItem("userData", JSON.stringify(response));
              this.router.navigate(["/", ...defaultRedirectURL]);
            } else {
              this._dataStore.dataStore$.next({
                ...state,
                ...catchCommonData,
                toastMessage: "Not verified."
              });
              this.router.navigate(["/sigin"]);
            }
            console.log(response);
          },
          error => {
            state = this._dataStore.dataStore$.getValue();

            this._dataStore.dataStore$.next({
              ...state,
              ...catchCommonData,
              toastMessage: _.get(error, "message", "Something Went Wrong!!")
            });
          }
        );
        break;

      case FORGOT_PASSWORD:
        this._loader.loadingState({ type: LOADING });

        console.log("IN FORGOT_PASSWORD");

        state = this._dataStore.dataStore$.getValue();

        this.apiService
          .get(`main/auth/forgot-password/${action.payload.email}`)
          .subscribe(
            (response: any) => {
              this.toast.toastState({
                type: SHOW_TOAST,
                payload: { message: response.message, type: "success" }
              });

              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData
              });
              this.router.navigate(["/sigin"]);
            },
            error => {
              console.log(error);

              state = this._dataStore.dataStore$.getValue();

              this._dataStore.dataStore$.next({
                ...state,
                ...catchCommonData,
                toastMessage: _.get(error, "message", "Something Went Wrong!!")
              });
            }
          );
        break;

      default:
        console.log("IN LOGIN DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
}
