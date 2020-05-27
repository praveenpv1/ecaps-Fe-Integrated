import {
  AddUserInfoAction,
  AddUserExtraDetailsAction,
  UpdateChildUserInfoAction,
} from "./../ngxs-actions/user.actions";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Store } from "@ngxs/store";
import { ApiService } from "@app/core/services/api.service";
import { HideLoaderAction } from "../ngxs-actions/loader.actions";
import {
  ShowToastAction,
  ErrorApiToastAction,
} from "../ngxs-actions/toast.actions";
import * as _ from "lodash";
import { Router } from "@angular/router";

export interface UserStateModel {
  userInfo: any;
  userExtraDetails: any;
}

@State({
  name: "userState",
  defaults: {
    userInfo: JSON.parse(localStorage.getItem("userData")),
    userExtraDetails: JSON.parse(localStorage.getItem("userExtraDetails")),
  },
})
@Injectable()
export class UserState {
  constructor(
    private store: Store,
    private apiService: ApiService,
    private router: Router
  ) {}

  @Action(AddUserInfoAction)
  addUserInfo(ctx: StateContext<UserStateModel>, action: AddUserInfoAction) {
    const { userInfo } = action;
    ctx.patchState({ userInfo });
  }

  @Action(AddUserExtraDetailsAction)
  addUserExtraDetails(ctx: StateContext<UserStateModel>) {
    const state = ctx.getState();
    this.apiService.get(`main/users/update/${state.userInfo._id}`).subscribe(
      ({ data }: any) => {
        ctx.patchState({ userExtraDetails: data });
        localStorage.setItem("userExtraDetails", JSON.stringify(data));
        this.store.dispatch(new HideLoaderAction());
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }

  @Action(UpdateChildUserInfoAction)
  updateChildUserInfo(
    ctx: StateContext<UserStateModel>,
    action: UpdateChildUserInfoAction
  ) {
    const state = ctx.getState();

    this.apiService
      .post(
        `main/users/update/${action.payload.id}`,
        _.omit(action.payload, "id")
      )
      .subscribe(
        (response: any) => {
          this.store.dispatch(new ShowToastAction(response.message, "success"));
          const path = _.get(action, "navigation.path", null);
          if (!_.isEmpty(path)) {
            this.router.navigate([path]);
          }
          // this._location.back();
          this.store.dispatch(new HideLoaderAction());
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }
}
