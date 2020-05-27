import {
  ForgotPasswordAction,
  LoginAction,
  VerifyEmailAction,
  SetPasswordAction,
} from "./../ngxs-actions/login.actions";
import {
  AddUserInfoAction,
  AddUserExtraDetailsAction,
} from "./../ngxs-actions/user.actions";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { ApiService } from "@app/core/services/api.service";
import { LoaderState } from "./LoaderState";
import { HideLoaderAction } from "../ngxs-actions/loader.actions";
import {
  ShowToastAction,
  ErrorApiToastAction,
} from "../ngxs-actions/toast.actions";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { AuthService } from "auth";
import { UserState } from "./UserState";

export interface LoginStateModel {}

@State({
  name: "loginState",
  defaults: {},
})
@Injectable()
export class LoginState {
  constructor(
    private store: Store,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  @Action(ForgotPasswordAction)
  forgotPasswordAction(
    ctx: StateContext<LoginStateModel>,
    action: ForgotPasswordAction
  ) {
    this.apiService
      .get(`main/auth/forgot-password/${action.email}`, {}, false)
      .subscribe(
        (response: any) => {
          this.store.dispatch(new HideLoaderAction());
          if (_.get(response, "status", 500) === 200) {
            this.store.dispatch(
              new ShowToastAction(response.message, "success")
            );
            this.router.navigate(["/sigin"]);
          } else {
            this.store.dispatch(
              new ShowToastAction("Something Went Wrong!!", "warning")
            );
          }
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }

  @Action(LoginAction)
  loginAction(ctx: StateContext<LoginStateModel>, action: LoginAction) {
    this.apiService.login(action).subscribe(
      ({ data }: any) => {
        this.store.dispatch(new HideLoaderAction());
        this.authService.setAccessToken(data.token);
        if (data.is_verified) {
          this.store.dispatch(new AddUserInfoAction(data));
          localStorage.setItem("userData", JSON.stringify(data));
          this.store.dispatch(new AddUserExtraDetailsAction());
          // this.transaction.transactionReducer({
          //   type: GET_WALLET_TRANSACTION_LIST,
          //   payload: { id: data._id },
          // });
          this.router.navigate(["/", "dashboard"]);
        } else {
          this.store.dispatch(new ShowToastAction("Not Verified"));
          this.router.navigate(["/sigin"]);
        }
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }

  @Action(VerifyEmailAction)
  verifyEmailAction(
    ctx: StateContext<LoginStateModel>,
    action: VerifyEmailAction
  ) {
    this.apiService.verifyEmail(`main/auth/verify/${action.token}`).subscribe(
      (response: any) => {
        this.store.dispatch(new ShowToastAction(response.message, "success"));
        this.store.dispatch(new HideLoaderAction());
        this.router.navigate(["/sigin"]);
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }

  @Action(SetPasswordAction)
  setPasswordAction(
    ctx: StateContext<LoginStateModel>,
    action: SetPasswordAction
  ) {
    this.apiService
      .post(`main/auth/verify/${action.token}`, {
        newpassword: action.password,
      })
      .subscribe(
        (response: any) => {
          this.store.dispatch(new ShowToastAction(response.message, "success"));
          this.store.dispatch(new HideLoaderAction());
          this.router.navigate(["/sigin"]);
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }
}
