import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoginReducers } from "@app/core/store/reducers/login.reducer";
import { VERIFY_EMAIL } from "@app/core/store/actions";

@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.scss"]
})
export class VerifyEmailComponent implements OnInit {
  token: string = this.activatedRoute.snapshot.paramMap.get("token");
  constructor(
    private activatedRoute: ActivatedRoute,
    private login: LoginReducers
  ) {}

  ngOnInit() {}

  verifyEmail() {
    this.login.loginReducer({
      type: VERIFY_EMAIL,
      payload: {
        token: this.token
      }
    });
    console.log("====================================");
    console.log("Clicked", this.token);
    console.log("====================================");
  }
}
