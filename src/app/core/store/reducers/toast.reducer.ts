import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
  RESET_STATE,
  LOADING,
  NOT_LOADING,
  SHOW_TOAST,
  HIDE_TOAST,
  TOAST_SOMETHING_WRONG
} from "../actions";
import { catchCommonData } from "../commonstoredata";

@Injectable()
export class ToastReducers {
  constructor(private _dataStore: DataStore) {}

  toastState(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case SHOW_TOAST:
        console.log("IN TOAST TRUE");
        this._dataStore.dataStore$.next({
          ...state,
          toast: true,
          toastMessage: action.payload.message,
          toastType: action.payload.type
        });
        break;
      case HIDE_TOAST:
        console.log("IN TOAST FALSE");
        this._dataStore.dataStore$.next({
          ...state,
          toast: false,
          toastMessage: "",
          toastType: action.payload
        });
        break;
      case TOAST_SOMETHING_WRONG:
        console.log("IN TOAST FALSE");
        this._dataStore.dataStore$.next({
          ...state,
          toast: true,
          toastMessage: "Something Went Wrong!",
          toastType: "warning"
        });
        break;
      default:
        console.log("IN TOAST DEFAULT");
        this._dataStore.dataStore$.next({
          ...state,
          toast: false,
          toastMessage: "",
          toastType: action.payload
        });
    }
  }

  commonCatchToast(message: string) {
    const state = this._dataStore.dataStore$.getValue();

    this._dataStore.dataStore$.next({
      ...state,
      ...catchCommonData,
      toastMessage: message
    });
  }
}
