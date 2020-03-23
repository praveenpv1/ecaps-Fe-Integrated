import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef,
    Renderer2
} from "@angular/core";

import { MatSidenav } from "@angular/material";

import { Subscription } from "rxjs";

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
    NavigationError
} from "@angular/router";
import { DataStore } from "@app/core/store/app.store";
import { HIDE_TOAST } from "@app/core/store/actions";
import { ToastReducers } from "@app/core/store/reducers/toast.reducer";
import { NzMessageService } from "ng-zorro-antd/message";
import { NgxSpinnerService } from "ngx-spinner";
import * as _ from "lodash";
import { isAdmin } from "@app/core/services/utils";

interface SideNavRoute {
    icon?: string;
    route?: string;
    title?: string;
}

enum messageType {
    error = "error",
    success = "success",
    warning = "warning",
    loader = "loader"
}

@Component({
    selector: "app-nav",
    templateUrl: "./nav.component.html",
    styleUrls: ["./nav.component.scss"]
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
    companyBalance = "0";
    userName = "";
    userRole = "";
    noLoaderExists: boolean = true;
    subscribers: Subscription;
    company_id: string = "";
    customTheme: string = "theme-bronzeColor";
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
        private spinner: NgxSpinnerService
    ) {
        this.company_id = sessionStorage.getItem("company_id");

        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
                this.route.firstChild.data.subscribe(res => {
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
        this.message.remove(this.loaderId);
        this.logger.info("NavComponent: ngOnInit()");

        this.commandBarSidenavService.setSidenav(this.sidenav);

        this.loadNavListItems();

        this.subscribe();

        this.subscribers = this._dataStore.dataStore$.subscribe(data => {
            if (data.toast) {
                this.showToast(data.toastType, data.toastMessage);
                this._toastReducer.toastState({ type: HIDE_TOAST });
            }
            if (data.loader) {
                if (this.noLoaderExists) {
                    this.spinner.show();
                }
            } else {
                this.spinner.hide();
                this.noLoaderExists = true;
            }

            if (_.get(data.company.details, "data", null)) {
                this.companyBalance = _.get(
                    data.company.details,
                    "data.value",
                    0
                );
            }

            this.showUserName();
        });
    }

    showUserName(): void {
        const initialState = this._dataStore.dataStore$.getValue();
        if (initialState.userInfo) {
            this.userName = initialState.userInfo.first_name;
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
                this.createMessage(messageType.success, message);
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
            nzDuration: 0
        }).messageId;
    }

    async loadNavListItems() {
        this.myWorkRoutes = await this.configService.get("my-work-routes");

        this.myWorkRoutes.forEach(route => {
            this.translate.get(route.title).subscribe(value => {
                route.title = value;
            });
        });

        this.customerRoutes = await this.configService.get("customer-routes");

        this.customerRoutes.forEach(route => {
            this.translate.get(route.title).subscribe(value => {
                route.title = value;
            });
        });
    }

    public getUserInfo(): any {
        if (this.authService.getUser())
            this.userInfo = this.authService.getUser();

        return this.userInfo;
    }

    protected subscribe() {
        this.logger.info("NavComponent: subscribe()");

        this.subscription = this.dashboardService
            .getToolPaletteItems()
            .subscribe(data => {
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
        this.authService.logout("signin");
    }

    gotoAccountDetails(): void {
        this.router.navigate([
            "/",
            "account-details",
            sessionStorage.getItem("company_id")
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
        this.subscribers.unsubscribe();
        this.unsubscribe();
    }
}

// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.html
// https://github.com/tiberiuzuld/angular-gridster2/blob/master/src/app/sections/emptyCell/emptyCell.component.ts

// this.logger.info('toolPaletteItems: ' + JSON.stringify(this.toolPaletteItems));
