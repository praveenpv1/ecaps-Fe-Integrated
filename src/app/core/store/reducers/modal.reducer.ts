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
  SHOW_MODAL,
  HIDE_MODAL
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";

@Injectable()
export class ModalReducers {
  cardKitPath: string = MODEL_PATHS.card_kit;
  constructor(
    private _dataStore: DataStore,
    private apiService: ApiService,
    private _loader: LoadingReducers,
    private router: Router,
    private toast: ToastReducers
  ) {}

  cardReducer(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case SHOW_MODAL:
        console.log("IN SHOW MODAL");

        this._dataStore.dataStore$.next({
          ...state,
          modal: action.payload
        });
        break;
      case HIDE_MODAL:
        console.log("IN SHOW MODAL");

        this._dataStore.dataStore$.next({
          ...state,
          modal: this._dataStore.initialState["modal"]
        });
        break;
      default:
        console.log("IN CARD DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
  public checkCardStatus(data: Object) {
    return _.get(data, "cardStatusList[0]", "UNLOCKED") === "LOCKED";
  }
}
