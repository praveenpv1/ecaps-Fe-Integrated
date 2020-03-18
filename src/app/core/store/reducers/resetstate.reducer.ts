import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import { RESET_STATE } from "../actions";

@Injectable()
export class ResetStateReducers {
  constructor(private _dataStore: DataStore, private apiService: ApiService) {}

  resetState(action: any) {
    const initialState = this._dataStore.initialState;
    switch (action.type) {
      case RESET_STATE:
        console.log("IN RESET TRUE");
        this._dataStore.dataStore$.next({
          ...initialState
        });
        break;
      default:
        console.log("IN RESET DEFAULT");
        this._dataStore.dataStore$.next({
          ...initialState
        });
    }
  }
}
