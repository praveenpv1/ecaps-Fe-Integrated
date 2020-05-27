export class ChildUsersListAction {
  static readonly type = "[USER] Get Users List";
  constructor(public id: string, public childName: string) {}
}

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
