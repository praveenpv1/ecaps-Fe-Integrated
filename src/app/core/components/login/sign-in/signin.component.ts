import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "signin-component",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"]
})
export class SignInComponent implements OnInit, OnDestroy {
  verify: any = "";
  constructor(private activatedRoute: ActivatedRoute) {
    if (this.activatedRoute.snapshot.paramMap.get("verify")) {
      this.verify = this.activatedRoute.snapshot.paramMap.get("verify");
    }
  }

  public ngOnInit() {}

  public ngOnDestroy() {}
}
