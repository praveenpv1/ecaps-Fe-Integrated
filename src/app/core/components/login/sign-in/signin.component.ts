import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LOGIN, RESET_STATE } from "@app/core/store/actions";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";
import { AuthService } from "auth";
import { LoginReducers } from "@app/core/store/reducers/login.reducer";
import { Store } from "@ngxs/store";
import { LoginAction } from "@app/core/ngxs-store/ngxs-actions/login.actions";
import * as _ from "lodash";
import { StateResetAll } from "ngxs-reset-plugin";

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
    private loginReducer: LoginReducers,
    private store: Store
  ) {
    this.logout();
  }
  login() {
    if (this.signInForm.valid) {
      const email = this.signInForm.controls["email"].value.toLowerCase();
      const password = this.signInForm.controls["password"].value;
      // this.loginReducer.loginReducer({
      //   type: LOGIN,
      //   payload: {
      //     email: this.signInForm.controls["email"].value.toLowerCase(),
      //     password: this.signInForm.controls["password"].value,
      //   },
      // });
      this.store.dispatch(new LoginAction(_.trim(email), password));
    }
  }

  public ngOnInit() {}

  logout(): void {
    localStorage.setItem("userData", null);
    localStorage.setItem("userExtraDetails", null);
    localStorage.setItem("token", "");
    this.store.dispatch(new StateResetAll());
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
