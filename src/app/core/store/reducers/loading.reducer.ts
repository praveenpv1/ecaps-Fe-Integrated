import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import { RESET_STATE, LOADING, NOT_LOADING } from "../actions";

@Injectable()
export class LoadingReducers {
  constructor(private _dataStore: DataStore) {}

  loadingState(action: any) {
    const state = this._dataStore.dataStore$.getValue();
    switch (action.type) {
      case LOADING:
        console.log("IN LOAD TRUE");
        this._dataStore.dataStore$.next({
          ...state,
          loader: true
        });
        break;
      case NOT_LOADING:
        console.log("IN LOAD FALSE");
        this._dataStore.dataStore$.next({
          ...state,
          loader: false
        });
        break;
      default:
        console.log("IN LOAD DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
}
