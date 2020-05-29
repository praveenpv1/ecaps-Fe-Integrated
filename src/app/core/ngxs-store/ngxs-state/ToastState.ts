import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import {
  ShowToastAction,
  HideToastAction,
  ErrorApiToastAction,
} from "../ngxs-actions/toast.actions";
import { HideLoaderAction } from "../ngxs-actions/loader.actions";
import * as _ from "lodash";

export interface ToastStateModel {
  toast: boolean;
  toastType: string;
  toastMessage: string;
}

@State({
  name: "toastState",
  defaults: {
    toast: false,
    toastType: "error",
    toastMessage: "",
  },
})
@Injectable()
export class ToastState {
  constructor(private store: Store) {}

  @Action(ShowToastAction)
  showToast(ctx: StateContext<ToastStateModel>, action: ShowToastAction) {
    // const state = ctx.getState();

    ctx.setState({
      toast: true,
      toastType: action.toastType,
      toastMessage: action.toastMessage,
    });
  }
  @Action(HideToastAction)
  hideToast(ctx: StateContext<ToastStateModel>) {
    // const state = ctx.getState();
    ctx.setState({
      //   ...state,
      toast: false,
      toastType: "error",
      toastMessage: "",
    });
  }

  @Action(ErrorApiToastAction)
  errorApiToast(
    ctx: StateContext<ToastStateModel>,
    action: ErrorApiToastAction
  ) {
    // const state = ctx.getState();
    const toastMessage = _.get(
      action.error,
      "message",
      "Something Went Wrong!!"
    );
    ctx.setState({
      toast: true,
      toastMessage,
      toastType: action.toastType,
    });
    this.store.dispatch(new HideLoaderAction());
  }
}
