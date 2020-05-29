export class GetUserInfoAction {
  static readonly type = "[USER] Get UserInfo";
  constructor(public userInfo: object) {}
}

export class GetUserExtraDetailsAction {
  static readonly type = "[USER] Get User Extra Details";
}

export class UpdateChildUserInfoAction {
  static readonly type = "[USER] Update Child User Info";
  constructor(public payload: any, public navigation: any = {}) {}
}

export class AddChildUserAction {
  static readonly type = "[USER] Add Child User";
  constructor(public payload: any) {}
}

export class GetChildUserInfoAction {
  static readonly type = "[USER] Get Child User Info";
  constructor(public id: string) {}
}

export class GetChildUsersListAction {
  static readonly type = "[USER] Get Child Users List";
}
