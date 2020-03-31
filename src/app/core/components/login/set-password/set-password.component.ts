import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import * as _ from "lodash";
import { LoginReducers } from "@app/core/store/reducers/login.reducer";
import { ActivatedRoute } from "@angular/router";
import { SET_PASSWORD } from "@app/core/store/actions";

@Component({
  selector: "app-set-password",
  templateUrl: "./set-password.component.html",
  styleUrls: ["./set-password.component.scss"]
})
export class SetPasswordComponent implements OnInit {
  validateForm: FormGroup;
  isFormValid: boolean = false;
  token: string = this.activatedRoute.snapshot.paramMap.get("token");
  constructor(
    private fb: FormBuilder,
    private login: LoginReducers,
    private activatedRoute: ActivatedRoute
  ) {}

  submitForm() {
    console.log("====================================");
    console.log(this.validateForm);
    console.log("====================================");
    this.isFormValid =
      _.get(this.validateForm, "status", "INVALID") === "VALID";

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    if (this.isFormValid) {
      this.login.loginReducer({
        type: SET_PASSWORD,
        payload: {
          password: this.validateForm.controls.password.value,
          token: this.token
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls.checkPassword.updateValueAndValidity()
    );
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  ngOnInit() {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]]
    });
  }
}
