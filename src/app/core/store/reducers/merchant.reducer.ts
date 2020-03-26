import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  LOADING,
  GET_REIMBURSEMENT_MERCHANT_TXNS,
  GET_MERCHANT_TXNS
} from "../actions";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { ToastReducers } from "./toast.reducer";
import { LoadingReducers } from "./loading.reducer";

@Injectable()
export class MerchantReducers {
  merchantApi: string = MODEL_PATHS.merchant_transactions;
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private toast: ToastReducers,
    private _loader: LoadingReducers
  ) {}

  merchantReducer(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case GET_MERCHANT_TXNS:
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_get(`${this.merchantApi}`, "", {
            ...action.payload
          })
          .then(data => {
            let state = this._dataStore.dataStore$.getValue();
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              merchant_txns: {
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

      case GET_REIMBURSEMENT_MERCHANT_TXNS:
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_get(`${this.merchantApi}/${action.payload.id}`, "", {})
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              reimbursement_merchant_txns: {
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

      default:
        console.log("IN MERCHANT TXNS DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
}
