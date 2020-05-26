import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector } from "@ngxs/store";
import { ShowLoader, HideLoader } from "../ngxs-actions/loader.actions";
import { ShowToast, HideToast } from "../ngxs-actions/toast.actions";

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
  @Action(ShowToast)
  showToast(ctx: StateContext<ToastStateModel>, action: ShowToast) {
    // const state = ctx.getState();

    ctx.setState({
      toast: true,
      toastType: action.toastType,
      toastMessage: action.toastMessage,
    });
  }
  @Action(HideToast)
  hideToast(ctx: StateContext<ToastStateModel>) {
    // const state = ctx.getState();
    ctx.setState({
      //   ...state,
      toast: false,
      toastType: "error",
      toastMessage: "",
    });
  }
}
