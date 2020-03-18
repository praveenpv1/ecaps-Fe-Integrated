import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "signin-component",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"]
})
export class LandingPageComponent implements OnInit, OnDestroy {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  public ngOnInit() {}

  public ngOnDestroy() {}

  goToUrl(): void {
    this.document.location.href = "http://user.koppr.in";
  }
}
