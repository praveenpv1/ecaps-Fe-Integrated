import { ForgotPassword } from "./../ngxs-actions/login.actions";
import { ChildUsersList } from "./../ngxs-actions/user.actions";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { ApiService } from "@app/core/services/api.service";
import { LoaderState } from "./LoaderState";
import { ShowLoader, HideLoader } from "../ngxs-actions/loader.actions";
import { ShowToast } from "../ngxs-actions/toast.actions";
import * as _ from "lodash";
import { Router } from "@angular/router";

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
    private router: Router
  ) {}

  @Action(ForgotPassword)
  forgotPassword(ctx: StateContext<LoginStateModel>, action: ForgotPassword) {
    this.store.dispatch(new ShowLoader());

    this.apiService
      .get(`main/auth/forgot-password/${action.email}`, {}, false)
      .subscribe(
        (response: any) => {
          this.store.dispatch(new HideLoader());
          if (_.get(response, "status", 500) === 200) {
            this.store.dispatch(new ShowToast(response.message, "success"));
            this.router.navigate(["/sigin"]);
          } else {
            this.store.dispatch(
              new ShowToast("Something Went Wrong!!", "warning")
            );
          }
        },
        (error) => {
          this.store.dispatch(new ShowToast(error.message));
        }
      );
    // const state = ctx.getState();

    // ctx.setState({
    //   ...state,
    // });
  }
}
