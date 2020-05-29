export class GetMarginListAction {
  static readonly type = "[MARGINS] Get Margin list for specific type";
  constructor(public readonly marginType: string) {}
}

export class CreateNewMarginAction {
  static readonly type = "[MARGINS] Create new Margin for specific type";
  constructor(public readonly payload: any) {}
}
