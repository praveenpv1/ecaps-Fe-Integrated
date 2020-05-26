import { ChildUsersList } from "./../ngxs-actions/user.actions";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { ApiService } from "@app/core/services/api.service";
import { LoaderState } from "./LoaderState";
import { ShowLoader } from "../ngxs-actions/loader.actions";

export interface UserStateModel {
  userInfo: object;
  userExtraDetails: object;
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
    private loader: LoaderState
  ) {}

  @Action(ChildUsersList)
  showLoader(ctx: StateContext<UserStateModel>, action: ChildUsersList) {
    this.store.dispatch(new ShowLoader());
    const state = ctx.getState();

    ctx.setState({
      ...state,
    });
  }
}
