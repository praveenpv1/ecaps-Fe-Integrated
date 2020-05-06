import { DASHBOARD_COMBINED_APIS } from "./../actions/index";
import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  LOADING,
  NOT_LOADING,
  LOGIN,
  FETCH_USER_GRAPHQL,
  RESET_STATE,
  SHOW_TOAST,
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { AuthService } from "auth";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";
import { Location } from "@angular/common";

@Injectable()
export class DashboardReducers {
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private authService: AuthService,
    private router: Router,
    private toast: ToastReducers,
    private _location: Location,
    private resetReducer: ResetStateReducers
  ) {}

  dashboardReducer(action: any) {
    let state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case DASHBOARD_COMBINED_APIS:
        console.log("IN DASHBOARD_COMBINED_APIS");

        this._loader.loadingState({ type: LOADING });
        state = this._dataStore.dataStore$.getValue();
        const userId = state.userInfo._id;
        this.apiService.get(`main/users/update/${userId}`).subscribe(
          ({ data }: any) => {
            localStorage.setItem("userExtraData", JSON.stringify(data));

            this.apiService
              .get(`main/wallets/transactions/${userId}`)
              .subscribe(
                (response: any) => {
                  this._dataStore.dataStore$.next({
                    ...state,
                    ...successCommonData,
                    userWalletTransactionList: response,
                    userExtraDetails: data,
                  });
                },
                (error) => {
                  console.log(error);

                  state = this._dataStore.dataStore$.getValue();

                  this._dataStore.dataStore$.next({
                    ...state,
                    ...catchCommonData,
                    userExtraDetails: data,
                    toastMessage: _.get(
                      error,
                      "message",
                      "Something Went Wrong!!"
                    ),
                  });
                }
              );
          },
          (error) => {
            console.log(error);
            this.toast.commonCatchToast(
              _.get(error, "message", "Something Went Wrong!!")
            );
          }
        );
        break;

      default:
        console.log("IN USER DEFAULT");
        this._dataStore.dataStore$.next({
          ...state,
        });
    }
  }
}
