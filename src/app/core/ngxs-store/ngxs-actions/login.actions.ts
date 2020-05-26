export class ForgotPassword {
  static readonly type = "[LOGIN] Forgot Password";
  constructor(public email: string) {}
}
