export class GetTransactionListAction {
  static readonly type = "[TRANSACTIONS] Get wallet transactions";
  constructor(public payload: any) {}
}

export class SaveSelectedTransactionItemAcion {
  static readonly type = "[TRANSACTIONS] Save selected transaction Item";
  constructor(public payload: any) {}
}
