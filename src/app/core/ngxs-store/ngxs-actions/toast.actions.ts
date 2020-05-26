export const SHOW_TOAST = "[TOAST] show";
export const HIDE_TOAST = "[TOAST] hide";
export const TOAST_SOMETHING_WRONG = "[TOAST] Something Wrong";

export class ShowToast {
  static readonly type = "[TOAST] show";
  constructor(
    public toastMessage: string = "",
    public toastType: string = "error"
  ) {}
}

export class HideToast {
  static readonly type = "[TOAST] hide";
  //   constructor(
  //     public toastMessage: string = "",
  //     public toastType: string = "error"
  //   ) {}
}
