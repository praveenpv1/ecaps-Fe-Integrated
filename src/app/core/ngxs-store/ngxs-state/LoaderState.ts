import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import { ShowLoader, HideLoader } from "../ngxs-actions/loader.actions";

export interface LoaderStateModel {
  loading: boolean;
}

@State({
  name: "loaderState",
  defaults: {
    loading: false,
  },
})
@Injectable()
export class LoaderState {
  constructor() {}
  @Action(ShowLoader)
  showLoader(ctx: StateContext<LoaderStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loading: true,
    });
  }
  @Action(HideLoader)
  hideLoader(ctx: StateContext<LoaderStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      loading: false,
    });
  }
}
