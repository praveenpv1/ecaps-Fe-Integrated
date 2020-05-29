import { DataStore } from "./../../store/app.store";
// import {
//   CHILD_USERS_LIST,
//   UPDATE_CHILD_USER_INFO,
// } from "./../../store/actions/index";
import { UserReducers } from "./../../store/reducers/user.reducer";
import { Component, OnInit, OnDestroy } from "@angular/core";
import * as _ from "lodash";
import { Store } from "@ngxs/store";
import {
  GetChildUsersListAction,
  UpdateChildUserInfoAction,
} from "@app/core/ngxs-store/ngxs-actions/user.actions";

@Component({
  selector: "app-loyalty",
  templateUrl: "./loyalty.component.html",
  styleUrls: ["./loyalty.component.scss"],
})
export class LoyaltyComponent implements OnInit, OnDestroy {
  isVisible = false;
  isOkLoading = false;
  searchText = "";
  loyaltyValue = "enviar";
  // initialState: any = "";
  selectedUser: any;
  storeSubscriber: any;
  childLists = [];

  constructor(
    // private user: UserReducers,
    // private ds: DataStore,
    private store: Store
  ) {
    // this.initialState = ds.dataStore$.getValue();
  }

  ngOnInit() {
    // this.user.userReducer({
    //   type: CHILD_USERS_LIST,
    //   payload: {
    //     id: _.get(this.initialState, "userInfo._id", null),
    //     childName: "childrenList",
    //   },
    // });

    // this.ds.dataStore$.subscribe((data) => {
    //   this.childLists = data.childrenList;
    // });

    this.store.dispatch(new GetChildUsersListAction());

    this.storeSubscriber = this.store.subscribe(({ userState }) => {
      this.childLists = userState.childrenList;
    });
  }

  ngOnDestroy(): void {
    this.storeSubscriber.unsubscribe();
  }

  showModal(data): void {
    this.isVisible = true;
    this.selectedUser = data;
    const lValue = _.get(data, "loyalty", "enviar");
    if (
      ["enviar", "goldColor", "silverColor", "bronzeColor"].includes(lValue)
    ) {
      this.loyaltyValue = lValue;
    } else this.loyaltyValue = "enviar";
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);

    // this.user.userReducer({
    //   type: UPDATE_CHILD_USER_INFO,
    //   payload: {
    //     id: this.selectedUser._id,
    //     loyalty: this.loyaltyValue,
    //   },
    //   navigation: {
    //     path: "/loyalty",
    //   },
    // });

    const payload = {
      id: this.selectedUser._id,
      loyalty: this.loyaltyValue,
    };
    const navigation = {
      path: "/loyalty",
    };

    this.store.dispatch(new UpdateChildUserInfoAction(payload, navigation));
    setTimeout(() => {
      this.store.dispatch(new GetChildUsersListAction());
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
