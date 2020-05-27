import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LoginReducers } from "@app/core/store/reducers/login.reducer";
import { VERIFY_EMAIL } from "@app/core/store/actions";
import { Store } from "@ngxs/store";
import { VerifyEmailAction } from "@app/core/ngxs-store/ngxs-actions/login.actions";

@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.scss"],
})
export class VerifyEmailComponent implements OnInit {
  token: string = this.activatedRoute.snapshot.paramMap.get("token");
  constructor(
    private activatedRoute: ActivatedRoute,
    private login: LoginReducers,
    private store: Store
  ) {}

  ngOnInit() {}

  verifyEmail() {
    // this.login.loginReducer({
    //   type: VERIFY_EMAIL,
    //   payload: {
    //     token: this.token
    //   }
    // });
    this.store.dispatch(new VerifyEmailAction(this.token));
    console.log("====================================");
    console.log("Clicked", this.token);
    console.log("====================================");
  }
}
