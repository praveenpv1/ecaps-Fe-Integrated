import { ADD_CHILD, SHOW_TOAST } from "./../actions/index";
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
  USERS_LIST
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
export class UserReducers {
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

  userReducer(action: any) {
    let state = this._dataStore.dataStore$.getValue();
    const employeePath = MODEL_PATHS.employees;
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
            console.log(error);
          }
        );
        break;
      case ADD_USER_INFO:
        console.log("IN USER ADD");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .pk_get(MODEL_PATHS.employees, "me", {})
          .then(data => {
            sessionStorage.setItem("userInfo", JSON.stringify(data));

            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              userInfo: data
            });
          })
          .catch(error => {
            state = this._dataStore.dataStore$.getValue();

            this._dataStore.dataStore$.next({
              ...state,
              ...catchCommonData,
              toastMessage: error.response.data.error
            });
          });
        break;

      case USERS_LIST:
        console.log("IN USERS_LIST");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .post(`main/users/allusers`, { pid: action.payload.id })
          .subscribe(
            (response: any) => {
              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
                [action.payload.childName]: response.data
              });
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

      case ADD_CHILD:
        console.log("IN ADD_CHILD");
        this._loader.loadingState({ type: LOADING });
        this.apiService.post(`main/users/add`, { ...action.payload }).subscribe(
          (response: any) => {
            this.toast.toastState({
              type: SHOW_TOAST,
              payload: { message: response.message, type: "success" }
            });

            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData
            });
            // this.router.navigate(["/sigin"]);

            this._location.back();
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
        console.log("IN USER DEFAULT");
        this._dataStore.dataStore$.next({
          ...state
        });
    }
  }
}
