import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { LoginReducers } from "@app/core/store/reducers/login.reducer";
import { FORGOT_PASSWORD } from "@app/core/store/actions";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"]
})
export class ForgotPasswordComponent implements OnInit {
  validateForm: FormGroup;

  constructor(private fb: FormBuilder, private forgot: LoginReducers) {}

  submitForm() {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      this.forgot.loginReducer({
        type: FORGOT_PASSWORD,
        payload: { email: this.validateForm.controls["email"].value }
      });
    }
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]]
    });
  }
}
