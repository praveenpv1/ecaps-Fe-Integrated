import {
  ADD_CHILD,
  GET_CHILD_USER_INFO,
  CHILD_USERS_LIST,
  ADD_USER_INFO,
  UPDATE_CHILD_USER_INFO,
  USER_EXTRA_DETAILS,
  GET_WALLET_TRANSACTION_LIST,
} from "./../actions/index";
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
export class TransactionReducers {
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

  transactionReducer(action: any) {
    let state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case GET_WALLET_TRANSACTION_LIST:
        console.log("IN GET_WALLET_TRANSACTION_LIST");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .get(`main/wallets/transactions/${state.userInfo._id}`)
          .subscribe(
            (response: any) => {
              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
                userWalletTransactionList: response,
              });
            },
            (error) => {
              console.log(error);

              state = this._dataStore.dataStore$.getValue();

              this._dataStore.dataStore$.next({
                ...state,
                ...catchCommonData,
                toastMessage: _.get(error, "message", "Something Went Wrong!!"),
              });
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
