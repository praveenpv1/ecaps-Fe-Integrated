import {
  GetUserInfoAction,
  GetUserExtraDetailsAction,
  UpdateChildUserInfoAction,
  AddChildUserAction,
  GetChildUserInfoAction,
  GetChildUsersListAction,
} from "./../ngxs-actions/user.actions";
import { Injectable } from "@angular/core";
import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { ApiService } from "@app/core/services/api.service";
import { HideLoaderAction } from "../ngxs-actions/loader.actions";
import {
  ShowToastAction,
  ErrorApiToastAction,
} from "../ngxs-actions/toast.actions";
import * as _ from "lodash";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

export interface UserStateModel {
  userInfo: any;
  userExtraDetails: any;
  childUser: any;
  childrenList: any;
}

@State({
  name: "userState",
  defaults: {
    userInfo: JSON.parse(localStorage.getItem("userData")),
    userExtraDetails: JSON.parse(localStorage.getItem("userExtraDetails")),
    childUser: {},
    childrenList: [],
  },
})
@Injectable()
export class UserState {
  constructor(
    private store: Store,
    private apiService: ApiService,
    private _location: Location,
    private router: Router
  ) {}

  @Selector()
  static userId(state: UserStateModel) {
    return state.userInfo._id;
  }

  @Action(GetUserInfoAction)
  addUserInfo(ctx: StateContext<UserStateModel>, action: GetUserInfoAction) {
    const { userInfo } = action;
    ctx.patchState({ userInfo });
  }

  @Action(GetUserExtraDetailsAction)
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

  @Action(AddChildUserAction)
  addChildUser(ctx: StateContext<UserStateModel>, action: AddChildUserAction) {
    const state = ctx.getState();
    this.apiService.post(`main/users/add`, { ...action.payload }).subscribe(
      (response: any) => {
        this.store.dispatch(new ShowToastAction(response.message, "success"));
        this._location.back();
        this.store.dispatch(new HideLoaderAction());
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }

  @Action(GetChildUserInfoAction)
  getChildUserInfo(
    ctx: StateContext<UserStateModel>,
    action: GetChildUserInfoAction
  ) {
    const state = ctx.getState();
    this.apiService.get(`main/users/update/${action.id}`).subscribe(
      (response: any) => {
        ctx.patchState({ childUser: response.data });
        this.store.dispatch(new HideLoaderAction());
      },
      (error) => {
        this.store.dispatch(new ErrorApiToastAction(error));
      }
    );
  }

  @Action(GetChildUsersListAction)
  getChildUsersList(ctx: StateContext<UserStateModel>) {
    const state = ctx.getState();
    this.apiService
      .post(`main/users/allusers`, { pid: state.userInfo._id })
      .subscribe(
        (response: any) => {
          ctx.patchState({ childrenList: response.data });
          this.store.dispatch(new HideLoaderAction());
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }
}
