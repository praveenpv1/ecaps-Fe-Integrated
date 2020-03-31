import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  ADD_USER_INFO,
  LOADING,
  NOT_LOADING,
  ASSIGN_CARD,
  GET_CARD_DETAILS,
  LOCK_UNLOCK_CARD
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { Router } from "@angular/router";

@Injectable()
export class CardReducers {
  cardKitPath: string = MODEL_PATHS.card_kit;
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private router: Router
  ) {}

  cardReducer(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case ASSIGN_CARD:
        console.log("IN ASSIGN_CARD");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_post(this.cardKitPath, {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              card: {
                ...state.card,
                assignCard: data
              }
            });
          })
          .catch(error => {
            console.log(error);
            this._dataStore.dataStore$.next({
              ...state,
              ...catchCommonData,
              toastMessage: error.response.data.error
            });
          });
        break;
      case GET_CARD_DETAILS:
        console.log("IN GET_CARD_DETAILS");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_get(this.cardKitPath, "", {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              card: {
                ...state.card,
                cardDetails: data
              }
            });
          })
          .catch(error => {
            this._dataStore.dataStore$.next({
              ...state,
              ...catchCommonData,
              toastMessage: error.response.data.error
            });
          });
        break;
      case LOCK_UNLOCK_CARD:
        console.log("IN LOCK_UNLOCK_CARD");
        this._loader.loadingState({ type: LOADING });

        this.apiService
          .pk_post(`${this.cardKitPath}/lock`, {
            ...action.payload
          })
          .then(data => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              card: {
                ...state.card,
                isLocked: _.get(action.payload, "flag", "L") === "L"
              }
            });
            this.router.navigate(["/cards"]);
          })
          .catch(error => {
            this.router.navigate(["/deactivate-card"]);
            this._dataStore.dataStore$.next({
              ...state,
              ...catchCommonData,
              toastMessage: error.response.data.error
            });
          });
        break;
      default:
        console.log("IN ASSIGN_CARD DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
}
