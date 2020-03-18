import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { LOGIN, RESET_STATE } from "@app/core/store/actions";
import { ResetStateReducers } from "@app/core/store/reducers/resetstate.reducer";
import { AuthService } from "auth";

@Component({
  selector: "signin-component-inner",
  templateUrl: "./signin-inner.component.html",
  styleUrls: ["./signin-inner.component.scss"]
})
export class SignInInnerComponent implements OnInit, OnDestroy {
  showPassword: boolean = false;
  signInForm = new FormGroup({
    email: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    private userReducer: UserReducers,
    private resetReducer: ResetStateReducers,
    private authService: AuthService
  ) {
    //clear state
    this.resetReducer.resetState({
      type: RESET_STATE,
      payload: {}
    });

    localStorage.setItem("token", "");
    sessionStorage.setItem("company_id", "");
  }

  login() {
    if (this.signInForm.valid) {
      this.userReducer.userReducer({
        type: LOGIN,
        payload: {
          email: this.signInForm.controls["email"].value.toLowerCase(),
          password: this.signInForm.controls["password"].value
        }
      });
    }
  }

  public ngOnInit() {}

  public ngOnDestroy() {}

  togglePasswordDisplay() {
    this.showPassword = !this.showPassword;
  }

  public isFormValid(formName: string) {
    return !this.signInForm.controls[formName].errors;
  }
}
