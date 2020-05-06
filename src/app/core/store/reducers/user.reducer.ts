import {
  ADD_CHILD,
  GET_CHILD_USER_INFO,
  CHILD_USERS_LIST,
  ADD_USER_INFO,
  UPDATE_CHILD_USER_INFO,
  USER_EXTRA_DETAILS,
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
      case CHILD_USERS_LIST:
        console.log("IN CHILD_USERS_LIST");
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .post(`main/users/allusers`, { pid: action.payload.id })
          .subscribe(
            (response: any) => {
              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
                [action.payload.childName]: response.data,
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

      case GET_CHILD_USER_INFO:
        this._loader.loadingState({ type: LOADING });
        state = this._dataStore.dataStore$.getValue();
        this.apiService.get(`main/users/update/${action.payload.id}`).subscribe(
          (response: any) => {
            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
              childUser: response.data,
            });
          },
          (error) => {
            this.toast.commonCatchToast(
              _.get(error, "message", "Something Went Wrong!!")
            );
          }
        );
        break;

      case ADD_CHILD:
        console.log("payload", action.payload);
        console.log("IN ADD_CHILD");
        this._loader.loadingState({ type: LOADING });

        this.apiService.post(`main/users/add`, { ...action.payload }).subscribe(
          (response: any) => {
            this.toast.toastState({
              type: SHOW_TOAST,
              payload: { message: response.message, type: "success" },
            });

            this._dataStore.dataStore$.next({
              ...state,
              ...successCommonData,
            });
            // this.router.navigate(["/sigin"]);

            this._location.back();
          },
          (error) => {
            this.toast.commonCatchToast(
              _.get(error, "message", "Something Went Wrong!!")
            );
          }
        );
        break;

      case UPDATE_CHILD_USER_INFO:
        this._loader.loadingState({ type: LOADING });
        this.apiService
          .post(
            `main/users/update/${action.payload.id}`,
            _.omit(action.payload, "id")
          )
          .subscribe(
            (response: any) => {
              this.toast.toastState({
                type: SHOW_TOAST,
                payload: {
                  message: response.message,
                  type: "success",
                },
              });

              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
              });
              // this.router.navigate(["/sigin"]);
              const path = _.get(action, "navigation.path", null);
              if (!_.isEmpty(path)) {
                this.router.navigate([path]);
              }

              // this._location.back();
            },
            (error) => {
              this.toast.commonCatchToast(
                _.get(error, "message", "Something Went Wrong!!")
              );
            }
          );
        break;

      case USER_EXTRA_DETAILS:
        this._loader.loadingState({ type: LOADING });
        state = this._dataStore.dataStore$.getValue();
        this.apiService
          .get(`main/users/update/${state.userInfo._id}`)
          .subscribe(
            ({ data }: any) => {
              localStorage.setItem("userExtraData", JSON.stringify(data));

              this._dataStore.dataStore$.next({
                ...state,
                ...successCommonData,
                userExtraDetails: data,
              });
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
