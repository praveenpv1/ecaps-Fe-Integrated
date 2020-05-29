import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import {
  ShowLoaderAction,
  HideLoaderAction,
} from "../ngxs-actions/loader.actions";
import {
  RequestFundLoadAction,
  GetFundLoadRequestsListAction,
  ApproveFundLoadRequestAction,
} from "../ngxs-actions/funds.actions";
import { ApiService } from "@app/core/services/api.service";
import {
  ShowToastAction,
  ErrorApiToastAction,
} from "../ngxs-actions/toast.actions";
import { UserState } from "./UserState";
import { GetUserExtraDetailsAction } from "../ngxs-actions/user.actions";
import { Router } from "@angular/router";

export interface LoaderStateModel {
  fundLoadRequests: [];
}

@State({
  name: "fundState",
  defaults: {
    fundLoadRequests: [],
  },
})
@Injectable()
export class FundState {
  constructor(
    private apiService: ApiService,
    private store: Store,
    private router: Router
  ) {}

  @Action(RequestFundLoadAction)
  requestFundLoad(
    ctx: StateContext<LoaderStateModel>,
    action: RequestFundLoadAction
  ) {
    const userInfo = this.store.selectSnapshot(UserState.userInfo);
    const userId = userInfo._id;
    this.apiService
      .post(`main/fundloads/new-request`, {
        ...action.payload,
        uid: userId,
      })
      .subscribe(
        (response: any) => {
          this.store.dispatch(new ShowToastAction(response.message, "success"));
          this.store.dispatch(new HideLoaderAction());
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }

  @Action(GetFundLoadRequestsListAction)
  getFundLoadRequestsListAction(
    ctx: StateContext<LoaderStateModel>,
    action: GetFundLoadRequestsListAction
  ) {
    const userInfo = this.store.selectSnapshot(UserState.userInfo);
    const userId = userInfo._id;

    this.apiService.get(`main/fundloads/pendingtoapprove/${userId}`).subscribe(
      (response: any) => {
        ctx.patchState({ fundLoadRequests: response.data });
        this.store.dispatch(new HideLoaderAction());
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }

  @Action(ApproveFundLoadRequestAction)
  approveFundLoadRequestAction(
    ctx: StateContext<LoaderStateModel>,
    action: ApproveFundLoadRequestAction
  ) {
    this.apiService.get(`main/fundloads/approve/${action.requestId}`).subscribe(
      (response: any) => {
        this.store.dispatch(new ShowToastAction(response.message, "success"));
        // this.store.dispatch(new GetFundLoadRequestsListAction());
        this.store.dispatch(new GetUserExtraDetailsAction());
        this.router.navigate(["/wallet-load-request"]);

        this.store.dispatch(new HideLoaderAction());
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }
}
