export class AddUserInfoAction {
  static readonly type = "[USER] Add UserInfo";
  constructor(public userInfo: object) {}
}

export class AddUserExtraDetailsAction {
  static readonly type = "[USER] Add User Extra Details";
}

export class UpdateChildUserInfoAction {
  static readonly type = "[USER] Update Child User Info";
  constructor(public payload: any) {}
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
  constructor(public id: string) {}
}
