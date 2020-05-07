import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LOGIN, RESET_STATE } from "@app/core/store/actions";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";
import { AuthService } from "auth";
import { LoginReducers } from "@app/core/store/reducers/login.reducer";

@Component({
  selector: "signin-component",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SignInComponent implements OnInit, OnDestroy {
  showPassword: boolean = false;
  signInForm = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
  constructor(
    private resetReducer: ResetStateReducers,
    private authService: AuthService,
    private loginReducer: LoginReducers
  ) {
    //clear state
    this.resetReducer.resetState({
      type: RESET_STATE,
      payload: {},
    });

    localStorage.setItem("token", "");
    sessionStorage.setItem("company_id", "");
  }
  login() {
    if (this.signInForm.valid) {
      this.loginReducer.loginReducer({
        type: LOGIN,
        payload: {
          email: this.signInForm.controls["email"].value.toLowerCase(),
          password: this.signInForm.controls["password"].value,
        },
      });
    }
  }

  public ngOnInit() {
    this.logout();
  }

  logout(): void {
    localStorage.setItem("userData", null);
    localStorage.setItem("userExtraData", null);
    this.authService.logout("signin");
  }

  public ngOnDestroy() {}

  togglePasswordDisplay() {
    this.showPassword = !this.showPassword;
  }

  public isFormValid(formName: string) {
    return !this.signInForm.controls[formName].errors;
  }
}
