import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import {
  ShowLoaderAction,
  HideLoaderAction,
} from "../ngxs-actions/loader.actions";
import { ApiService } from "@app/core/services/api.service";
import {
  ShowToastAction,
  ErrorApiToastAction,
} from "../ngxs-actions/toast.actions";
import {
  GetMarginListAction,
  CreateNewMarginAction,
} from "../ngxs-actions/margin.actions";
import { Router } from "@angular/router";

export interface MarginStateModel {
  marginList: [];
}

@State({
  name: "marginState",
  defaults: {
    marginList: [],
  },
})
@Injectable()
export class MarginState {
  constructor(
    private apiService: ApiService,
    private store: Store,
    private router: Router
  ) {}

  @Action(GetMarginListAction)
  getMarginList(
    ctx: StateContext<MarginStateModel>,
    action: GetMarginListAction
  ) {
    this.apiService
      .get(`main/settings/margin-get/${action.marginType}`)
      .subscribe(
        (response: any) => {
          ctx.patchState({ marginList: response.data });
          this.store.dispatch(new HideLoaderAction());
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }

  @Action(CreateNewMarginAction)
  createNewMargin(
    ctx: StateContext<MarginStateModel>,
    action: CreateNewMarginAction
  ) {
    this.apiService
      .post(`main/settings/margin-create`, action.payload)
      .subscribe(
        (response: any) => {
          this.store.dispatch(new ShowToastAction(response.message, "success"));

          this.router.navigate(["/margins"]);
          this.store.dispatch(new HideLoaderAction());
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }
}
