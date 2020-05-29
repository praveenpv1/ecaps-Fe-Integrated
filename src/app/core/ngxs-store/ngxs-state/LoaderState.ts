import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import {
  ShowLoaderAction,
  HideLoaderAction,
} from "../ngxs-actions/loader.actions";

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
  @Action(ShowLoaderAction)
  showLoader(ctx: StateContext<LoaderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ loading: true });

    // ctx.setState({
    //   ...state,
    //   loading: true,
    // });
  }
  @Action(HideLoaderAction)
  hideLoader(ctx: StateContext<LoaderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ loading: false });
    // ctx.setState({
    //   ...state,
    //   loading: false,
    // });
  }
}
