import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2,
} from "@angular/core";

import { MatSidenav } from "@angular/material";

import { Subscription, Observable } from "rxjs";

import { TranslateService } from "@ngx-translate/core";

import { AuthService } from "auth";

import { SidenavService } from "koppr-components";
import { MockDashboardService, ToolPaletteItem } from "dashboard";

import { ConfigService, LoggerService } from "utils";
import { ActivatedRoute } from "@angular/router";
import { menuType } from "@app/app-routing.module";
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from "@angular/router";
import { DataStore } from "@app/core/store/app.store";
import { HIDE_TOAST, USER_EXTRA_DETAILS } from "@app/core/store/actions";
import { ToastReducers } from "@app/core/store/reducers/toast.reducer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { isAdmin } from "@app/core/services/utils";
import { UserReducers } from "@app/core/store/reducers/user.reducer";
import { LoaderState } from "@app/core/ngxs-store/ngxs-state/LoaderState";
import { Store } from "@ngxs/store";
import { HideToastAction } from "@app/core/ngxs-store/ngxs-actions/toast.actions";

interface SideNavRoute {
  icon?: string;
  route?: string;
  title?: string;
}

enum messageType {
  error = "error",
  success = "success",
  warning = "warning",
  loader = "loader",
}

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild("commandbarSidenav", { static: true })
  public sidenav: MatSidenav;

  public myWorkRoutes: SideNavRoute[];
  public customerRoutes: SideNavRoute[];

  public toolPaletteItems: ToolPaletteItem[];

  protected subscription: Subscription;
  public userInfo: any = "";
  isCollapsed = false;
  menuTypes = menuType;
  currentMenuType: any = menuType.normal;
  loaderId: any = "";
  userBalance = "0";
  userName = "";
  userRole = "";
  masterRole: string = null;
  noLoaderExists: boolean = true;
  subscribers: Subscription;
  company_id: string = "";
  customTheme: string = "theme-enviar";
  currentNavigationPath: string = "";
  constructor(
    private commandBarSidenavService: SidenavService,
    private dashboardService: MockDashboardService,
    private authService: AuthService,
    private configService: ConfigService,
    private translate: TranslateService,
    private logger: LoggerService,
    private router: Router,
    private route: ActivatedRoute,
    private _dataStore: DataStore,
    private _toastReducer: ToastReducers,
    private message: NzMessageService,
    private spinner: NgxSpinnerService,
    private child: UserReducers,
    private store: Store
  ) {
    const initialState = this._dataStore.dataStore$.getValue();

    // this.child.userReducer({
    //   type: USER_EXTRA_DETAILS,
    //   payload: { id: initialState.userInfo._id },
    // });

    this.company_id = sessionStorage.getItem("company_id");
    this.masterRole = _.get(initialState.userExtraDetails, "pan", null);

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        this.currentNavigationPath = event.url;
        // Hide loading indicator
        this.route.firstChild.data.subscribe((res) => {
          this.currentMenuType = res.menuType;
        });
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

  createMessage(type: string, message: string): void {
    if (type != "") {
      this.message.create(type, message);
    } else {
      this.message.info(message);
    }
  }

  public ngOnInit(): void {
    this.store
      .select((state) => state)
      .subscribe((store) => {
        if (store.loaderState) {
          const { loaderState } = store;
          if (loaderState.loading) {
            this.spinner.show();
          } else {
            this.spinner.hide();
          }
        }
        if (store.toastState) {
          const { toastState } = store;
          if (toastState.toast) {
            this.showToast(toastState.toastType, toastState.toastMessage);
            this.store.dispatch(new HideToastAction());
          }
        }
      });

    this.message.remove(this.loaderId);
    this.logger.info("NavComponent: ngOnInit()");

    this.commandBarSidenavService.setSidenav(this.sidenav);

    this.loadNavListItems();

    this.subscribe();

    const token = localStorage.getItem("token");
    if (token) {
      this.child.userReducer({
        type: USER_EXTRA_DETAILS,
      });
    }

    this.subscribers = this._dataStore.dataStore$.subscribe((data) => {
      this.masterRole = _.get(data.userExtraDetails, "pan", null);
      this.userRole = _.get(data.userInfo, "role", null);
      console.log("extradetails", data.userExtraDetails);
      if (data.toast) {
        this.showToast(data.toastType, data.toastMessage);
        this._toastReducer.toastState({ type: HIDE_TOAST });
      }
      if (data.loader) {
        this.spinner.show();
        //   if (this.noLoaderExists) {
        //   this.spinner.show();
        // }
      } else {
        this.spinner.hide();
        this.noLoaderExists = true;
      }

      this.userBalance = _.get(data.userExtraDetails, "wallet_balance", 0);

      this.showUserName();
      this.checkRole();
      this.setTheme(data.userExtraDetails);
    });
  }

  showUserName(): void {
    const initialState = this._dataStore.dataStore$.getValue();
    if (initialState.userInfo) {
      this.userName = initialState.userInfo.name;
    }
  }

  checkRole(): void {
    const initialState = this._dataStore.dataStore$.getValue();
    if (initialState.userInfo) {
      this.userRole = initialState.userInfo.role;
    }
  }

  isRole(role: string): boolean {
    let roles = [];
    const initialState = this._dataStore.dataStore$.getValue();
    if (initialState.roles) {
      //roles = initialState.roles.split(",");
    }
    return roles.includes(role);
  }

  public showToast(type: string, message: string): void {
    switch (type) {
      case "error":
        if (message) this.createMessage(messageType.error, message);
        break;
      case "info":
        this.createMessage("", message);
        break;
      case "success":
        // this.createMessage(messageType.success, message);
        this.message.success(message);
        break;
      case "warning":
        this.createMessage(messageType.warning, message);
        break;
    }
  }

  isAdmin(): boolean {
    let initialState = this._dataStore.dataStore$.getValue();
    return isAdmin(initialState.roles);
  }

  createBasicMessage(): void {
    const id = this.message.loading("Action in progress..", {
      nzDuration: 0,
    }).messageId;
  }

  showMenuForUser(menuName) {
    const initialState = this._dataStore.dataStore$.getValue();
    const allUsers = [
      "master",
      "admin",
      "distributor",
      "superdistributor",
      "retailer",
    ];
    console.log(this.masterRole);

    const masterRoles = ["main", "marketing", "kyc", "accounting"];
    // console.log(
    //   "INSIDE SHOW MENU",
    //   this.userRole,
    //   this.masterRole,
    //   initialState.userExtraDetails
    // );

    if (this.userRole === "master") {
      switch (menuName) {
        case "dashboard":
          return masterRoles.includes(this.masterRole);
        case "superDistributor":
          return ["kyc", "main"].includes(this.masterRole);

        case "distributor":
          return ["kyc", "main"].includes(this.masterRole);

        case "retailer":
          return ["kyc", "main"].includes(this.masterRole);

        case "ledgers":
          return ["accounting", "main"].includes(this.masterRole);

        case "earnings":
          return ["accounting", "main"].includes(this.masterRole);

        case "commissions":
          return ["accounting", "main"].includes(this.masterRole);

        case "loyalty":
          return ["marketing", "main"].includes(this.masterRole);

        case "transactions":
          return masterRoles.includes(this.masterRole);
        case "walletLoadRequest":
          return ["accounting", "main"].includes(this.masterRole);
        case "walletTopUp":
          return false;
        case "margins":
          return masterRoles.includes(this.masterRole);
      }
    } else {
      console.log("userRole", this.userRole);
      switch (menuName) {
        case "dashboard":
          return allUsers.includes(this.userRole);
        case "superDistributor":
          return [
            "admin",
            // "master"
          ].includes(this.userRole);

        case "distributor":
          return [
            "admin",
            // "master",
            "superdistributor",
          ].includes(this.userRole);
        case "retailer":
          return [
            "admin",
            // "master",
            "superdistributor",
            "distributor",
          ].includes(this.userRole);
        case "ledgers":
          return [
            // "master",
            "admin",
            "distributor",
            "superdistributor",
            "retailer",
          ].includes(this.userRole);
        case "earnings":
          return [
            // "master",
            "admin",
            "distributor",
            "superdistributor",
            "retailer",
          ].includes(this.userRole);
        case "commissions":
          return [
            // "master",
            "admin",
            "distributor",
            "superdistributor",
            "retailer",
          ].includes(this.userRole);
        // case "loyalty":
        //   return ["master"].includes(this.userRole);

        case "transactions":
          return [
            // "master",
            "admin",
            "distributor",
            "superdistributor",
            "retailer",
          ].includes(this.userRole);
        case "walletLoadRequest":
          return [
            // "master",
            "admin",
            "distributor",
            "superdistributor",
            // "retailer",
          ].includes(this.userRole);
        case "walletTopUp":
          return [
            // "master",
            "admin",
            "distributor",
            "superdistributor",
            "retailer",
          ].includes(this.userRole);
      }
    }
  }

  setTheme(data: any) {
    const themeKey = _.get(data, "loyalty", "enviar");
    if (
      ["enviar", "goldColor", "silverColor", "bronzeColor"].includes(themeKey)
    ) {
      this.customTheme = `theme-${themeKey}`;
    } else this.customTheme = "theme-enviar";

    console.log("THEME", this.customTheme);
  }

  isMenuSelected(route: string = "") {
    return this.currentNavigationPath.includes(route);
  }

  async loadNavListItems() {
    this.myWorkRoutes = await this.configService.get("my-work-routes");

    this.myWorkRoutes.forEach((route) => {
      this.translate.get(route.title).subscribe((value) => {
        route.title = value;
      });
    });

    this.customerRoutes = await this.configService.get("customer-routes");

    this.customerRoutes.forEach((route) => {
      this.translate.get(route.title).subscribe((value) => {
        route.title = value;
      });
    });
  }

  public getUserInfo(): any {
    if (this.authService.getUser()) this.userInfo = this.authService.getUser();

    return this.userInfo;
  }

  protected subscribe() {
    this.logger.info("NavComponent: subscribe()");

    this.subscription = this.dashboardService
      .getToolPaletteItems()
      .subscribe((data) => {
        this.toolPaletteItems = data;
      });
  }

  protected unsubscribe() {
    this.logger.info("DashboardComponent: unsubscribe()");

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout(): void {
    localStorage.setItem("userData", null);
    localStorage.setItem("userExtraDetails", null);
    this.authService.logout("signin");
  }

  gotoAccountDetails(): void {
    this.router.navigate([
      "/",
      "account-details",
      sessionStorage.getItem("company_id"),
    ]);
  }

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  public onDragStart(event, identifier) {
    this.logger.info("NavComponent: onDragStart()");

    event.dataTransfer.setData("widgetIdentifier", identifier);

    event.dataTransfer.setData("text/plain", "Drag Me Button");
    event.dataTransfer.dropEffect = "move";
  }

  public ngOnDestroy() {
    this.logger.info("NavComponent: ngOnDestroy()");
    // this.subscribers.unsubscribe();
    // this.unsubscribe();
  }
}

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.html
// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts

// this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));
