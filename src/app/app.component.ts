import { Component, OnInit, OnDestroy } from "@angular/core";
import { LoggerService } from "utils";
import { DataStore } from "./core/store/app.store";
import { rootReducers } from "./core/store/reducers";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [DataStore, ...rootReducers]
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(private logger: LoggerService) {}

  public ngOnInit() {
    this.logger.info("AppComponent: ngOnInit()");
  }

  public ngOnDestroy() {
    this.logger.info("AppComponent: ngOnDestroy()");
  }
}
