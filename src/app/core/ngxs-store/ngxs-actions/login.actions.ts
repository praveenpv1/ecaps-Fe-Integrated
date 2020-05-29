export class LoginAction {
  static readonly type = "[LOGIN] Login";
  constructor(public email: string, public password: string) {}
}
export class ForgotPasswordAction {
  static readonly type = "[LOGIN] Forgot Password";
  constructor(public email: string) {}
}

export class VerifyEmailAction {
  static readonly type = "[LOGIN] Verify Email";
  constructor(public token: string) {}
}

export class SetPasswordAction {
  static readonly type = "[LOGIN] Set Password";
  constructor(public token: string, public password: string) {}
}
