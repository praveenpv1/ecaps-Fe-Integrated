export class ChildUsersList {
  static readonly type = "[USER] Get Users List";
  constructor(public id: string, public childName: string) {}
}
