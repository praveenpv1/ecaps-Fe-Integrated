import { Injectable } from "@angular/core";
import { DataStore } from "../app.store";
import { ApiService } from "@app/core/services/api.service";
import {
    ADD_USER_INFO,
    LOADING,
    NOT_LOADING,
    LOGIN,
    FETCH_USER_GRAPHQL,
    RESET_STATE
} from "../actions";
import { LoadingReducers } from "./loading.reducer";
import { MODEL_PATHS } from "pk-client";
import { catchCommonData, successCommonData } from "../commonstoredata";
import * as _ from "lodash";
import { AuthService } from "auth";
import { Router } from "@angular/router";
import { ToastReducers } from "./toast.reducer";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";

@Injectable()
export class UserReducers {
    constructor(
        private _dataStore: DataStore,
        private apiService: ApiService,
        private _loader: LoadingReducers,
        private authService: AuthService,
        private router: Router,
        private toast: ToastReducers,
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
                            localStorage.setItem(
                                "userData",
                                JSON.stringify(response)
                            );
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
                // (
                //   response => {
                //     const token = _.get(response, "token", null);
                //     this.authService.setAccessToken(token);
                //     const responseStatus: number = _.get(
                //       response,
                //       "response.status",
                //       null
                //     );
                //     const isTokenIncluded = _.keys(response).includes("token");
                //     if (responseStatus === 200 || isTokenIncluded) {
                //       this.userReducer({ type: ADD_USER_INFO });

                //       this.apiService
                //         .get("/v1/auth_user", "", {})
                //         .then(resp => {
                //           const roles = _.get(resp, "roles", []);

                //           state = this._dataStore.dataStore$.getValue();

                //           if (roles.includes("admin")) {
                //             defaultRedirectURL = ["company", "listing"];
                //           }

                //           if (!(roles.includes("admin") || roles.includes("company"))) {
                //             state = this._dataStore.dataStore$.getValue();

                //             this._dataStore.dataStore$.next({
                //               ...state,
                //               ...catchCommonData,
                //               toastMessage: "Permission denied."
                //             });
                //             this.router.navigate(["/sigin"]);
                //             return;
                //           }

                //           this.apiService
                //             .get(employeePath + "/me", "", {})
                //             .then(data => {
                //               const res: any = data;
                //               state = this._dataStore.dataStore$.getValue();
                //               sessionStorage.setItem("roles", roles);
                //               this._dataStore.dataStore$.next({
                //                 ...state,
                //                 ...catchCommonData,
                //                 company_id: res.company,
                //                 roles: roles
                //               });

                //               sessionStorage.setItem("company_id", res.company);

                //               const isUserVerified =
                //                 _.get(resp, "email_verification", "") === "approved" &&
                //                 _.get(resp, "phone_verification", "") === "approved";

                //               if (
                //                 isUserVerified ||
                //                 _.get(resp, "username", "") == "care@koppr.in"
                //               ) {
                //                 this.router.navigate([
                //                   "/",
                //                   ...defaultRedirectURL,
                //                   res.company
                //                 ]);
                //               } else {
                //                 this._dataStore.dataStore$.next({
                //                   ...state,
                //                   ...catchCommonData,
                //                   toastMessage: "User not Verified. Please Verify."
                //                 });
                //                 this.router.navigate([
                //                   "/",
                //                   ...defaultRedirectURL,
                //                   res.company
                //                 ]);
                //               }
                //             });
                //         })
                //         .catch(error => {
                //           this.toast.commonCatchToast(error);
                //         });
                //     } else {
                //       this.toast.commonCatchToast("User not found!");
                //     }
                //   },
                //   error => {
                //     this.toast.commonCatchToast(error);
                //   }
                // );
                break;
            case ADD_USER_INFO:
                console.log("IN USER ADD");
                this._loader.loadingState({ type: LOADING });
                this.apiService
                    .get(MODEL_PATHS.employees, "me", {})
                    .then(data => {
                        sessionStorage.setItem(
                            "userInfo",
                            JSON.stringify(data)
                        );

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

            default:
                console.log("IN USER DEFAULT");
                this._dataStore.dataStore$.next({
                    ...state
                });
        }
    }
}
