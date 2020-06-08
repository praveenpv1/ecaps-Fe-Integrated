import { Injectable } from "@angular/core";
import { State, Action, StateContext, Selector, Store } from "@ngxs/store";
import {
  ShowLoaderAction,
  HideLoaderAction,
} from "../ngxs-actions/loader.actions";
import {
  GetTransactionListAction,
  SaveSelectedTransactionItemAcion,
} from "../ngxs-actions/transactions.actions";
import { UserState } from "./UserState";
import { ApiService } from "@app/core/services/api.service";
import { ErrorApiToastAction } from "../ngxs-actions/toast.actions";
import * as _ from "lodash";

export interface TransactionStateModel {
  userWalletTransactionList: [];
  selectedTransactionItem: any;
}

@State({
  name: "transactionState",
  defaults: {
    userWalletTransactionList: [],
    selectedTransactionItem: {},
  },
})
@Injectable()
export class TransactionState {
  constructor(private store: Store, private apiService: ApiService) {}

  @Action(GetTransactionListAction)
  getTransactionListAction(
    ctx: StateContext<TransactionStateModel>,
    action: GetTransactionListAction
  ) {
    const userId = this.store.selectSnapshot(UserState.userId);
    const encodeUrl = encodeURIComponent(JSON.stringify(action.payload));
    this.apiService
      .get(`main/wallets/transactions/${userId}`, { ...action.payload })
      .subscribe(
        (response: any) => {
          ctx.patchState({ userWalletTransactionList: response });
          this.store.dispatch(new HideLoaderAction());
        },
        (error) => {
          this.store.dispatch(new ErrorApiToastAction(error));
        }
      );
  }

  @Action(SaveSelectedTransactionItemAcion)
  saveSelectedTransactionItem(
    ctx: StateContext<TransactionStateModel>,
    action: SaveSelectedTransactionItemAcion
  ) {
    ctx.patchState({ selectedTransactionItem: action.payload });
  }
}
