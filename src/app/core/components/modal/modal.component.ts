import { Component, OnInit, OnDestroy } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";

import { AuthService } from "auth";

import { ConfigService, LoggerService } from "utils";
import { ActivatedRoute } from "@angular/router";
import { menuType } from "@app/app-routing.module";
import { Router } from "@angular/router";
import { DataStore } from "@app/core/store/app.store";
import { ModalReducers } from "@app/core/store/reducers/modal.reducer";
import { SHOW_MODAL, HIDE_MODAL } from "@app/core/store/actions";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  title: string = "";
  icon: string = "";
  message: string = "";
  closeButtonText: string = "";
  submitButtonText: string = "";
  routerLink: any = "";
  subscribers: any;
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private translate: TranslateService,
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private ds: DataStore,
    private modalReducer: ModalReducers
  ) {
    this.subscribers = this.ds.dataStore$.subscribe(res => {
      if (res.modal.title != "") {
        const modalData = res.modal;
        this.isVisible = modalData.showModal;
        this.title = modalData.title;
        this.icon = modalData.icon;
        this.message = modalData.message;
        this.closeButtonText = modalData.closeButtonText;
        this.submitButtonText = modalData.submitButtonText;
        this.routerLink = modalData.routerLink;
      }
    });
  }
  public ngOnInit(): void {}
  public ngOnDestroy() {
    this.subscribers.unsubscribe();
  }
  clearModalStore(): void {
    const state = this.ds.dataStore$.getValue();
    this.ds.dataStore$.next({
      ...state,
      modal: {}
    });
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    let returnURL: any = this.routerLink;
    this.isVisible = false;
    this.clearModalStore();
    if (returnURL) {
      this.router.navigate(returnURL);
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
