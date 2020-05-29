export class RequestFundLoadAction {
  static readonly type = "[FUND] Request fund load";
  constructor(public readonly payload: any) {}
}

export class GetFundLoadRequestsListAction {
  static readonly type = "[FUND] Get Request fund load request list";
}

export class ApproveFundLoadRequestAction {
  static readonly type = "[FUND] Approve fund load request";
  constructor(public readonly requestId: any) {}
}
