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
  USERS_LIST,
  FUND_LOAD
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { AuthService } from "auth";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";
import { UserReducers } from "./user.reducer";

@Injectable()
export class FundReducers {
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private authService: AuthService,
    private router: Router,
    private toast: ToastReducers,
    private resetReducer: ResetStateReducers,
    private user: UserReducers
  ) {}

  fundReducer(action: any) {
    let state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case FUND_LOAD:
        this._loader.loadingState({ type: LOADING });

        console.log("IN FUND_LOAD");

        state = this._dataStore.dataStore$.getValue();

        this.apiService
          .post(`main/fundloads/new-request`, {
            ...action.payload
          })
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
              //   this.router.navigate(["/sigin"]);
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
        console.log("IN FUND REDUCER DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
}