export const SHOW_TOAST = "[TOAST] show";
export const HIDE_TOAST = "[TOAST] hide";
export const TOAST_SOMETHING_WRONG = "[TOAST] Something Wrong";

export class ShowToastAction {
  static readonly type = "[TOAST] show";
  constructor(
    public toastMessage: string = "",
    public toastType: string = "error"
  ) {}
}

export class HideToastAction {
  static readonly type = "[TOAST] hide";
  //   constructor(
  //     public toastMessage: string = "",
  //     public toastType: string = "error"
  //   ) {}
}

export class ErrorApiToastAction {
  static readonly type =
    "[TOAST] Show Toast when error occured while calling an API";
  constructor(public error: any, public toastType: string = "error") {}
}
