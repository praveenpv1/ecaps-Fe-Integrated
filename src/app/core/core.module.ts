import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FlexLayoutModule } from "@angular/flex-layout";

//
// koppr Components lib
//

import { kopprComponentsModule } from "koppr-components";
import { ModalComponent } from "./components/modal/modal.component";
import { environment } from "@env/environment";
import { throwIfAlreadyLoaded } from "./module-import-guard";

// Lazy Loaded Libs -> app.module.ts
//

//
// Utils lib
//

import { UtilsModule, LoggerService } from "utils";
import { AngularMaterialModule } from "utils";
import { DynamicFormsModule } from "dynamic-forms";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DynamicFormsMaterialUIModule } from "@ng-dynamic-forms/ui-material";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzBreadCrumbModule } from "ng-zorro-antd/breadcrumb";
import { NgZorroAntdModule, NZ_ICONS } from "ng-zorro-antd";
import { IconDefinition } from "@ant-design/icons-angular";
import * as AllIcons from "@ant-design/icons-angular/icons";
import { NZ_I18N, en_US } from "ng-zorro-antd";
import { NzTableModule } from "ng-zorro-antd/table";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzDropDownModule } from "ng-zorro-antd/dropdown";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NgOtpInputModule } from "ng-otp-input";
import { NzModalModule } from "ng-zorro-antd/modal";
import { ChartsModule } from "ng2-charts";
import { FilterPipeByField } from "@app/core/pipe/filter.pipe";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { DatePipe, CurrencyPipe } from "@angular/common";
import { NgxSpinnerModule } from "ngx-spinner";
import { NzTabsModule } from "ng-zorro-antd/tabs";
import { NgxsModule } from "@ngxs/store";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsResetPluginModule } from "ngxs-reset-plugin";

// import { SalaryComponent } from "./components/salary/salary.component";
// import { AddEmployeeComponent } from "./components/employee/add-employee.component";
// import { EmployeeAddTypeSelectionComponent } from "./components/employee/employee-add-type-selection.component";
// import { BulkUploadComponent } from "./components/employee/bulk-upload.component";
// import { BulkUploadSuccessComponent } from "./components/employee/bulk-upload-success.component";
// import { ListComponent } from "./components/employee/list.component";
// import { DepositComponent } from "./components/company/deposit.component";
// import { CompanyListComponent } from "./components/company/companylist.component";
// import { CompanyDetailsComponent } from "./components/company/company-details.component";
// import { BankDetailsComponent } from "./components/company/bank-details.component";
// import { SelectPlanComponent } from "./components/company/select-plan.component";
// import { PlanPaymentComponent } from "./components/company/plan-payment.component";
// import { PaySalaryComponent } from "./components/salary/pay-salary.component";
// import { ConfirmSalaryPaymentComponent } from "./components/salary/confirm-salary-payment.component";
// import { SalaryPaymentResponseComponent } from "./components/salary/salary-payment-response.component";
// import { TopUpPaymentResponseComponent } from "./components/salary/top-up-payment-response.component";
// import { TopUpPaymentComponent } from "./components/salary/top-up-payment.component";
// import { TopUpComponent } from "./components/salary/top-up.component";
// import { UserComponent } from "./components/account/user.component";
// import { KopprAccountDetailsComponent } from "./components/account/koppr-account-details.component";
// import { AddNewUserComponent } from "./components/account/addnewuser.component";
// import { UserDetailsComponent } from "./components/account/userdetails.component";
// import { PayAllowanceComponent } from "@app/core/components/allowance/pay-allowance.component";
// import { ConfirmAllowancePaymentComponent } from "@app/core/components/allowance/confirm-allowance-payment.component";
// import { AllowancePaymentResponseComponent } from "@app/core/components/allowance/allowance-payment-response.component";
// import { AllowanceTopUpPaymentResponseComponent } from "@app/core/components/allowance/top-up-payment-response.component";
// import { AllowanceTopUpPaymentComponent } from "@app/core/components/allowance/top-up-payment.component";
// import { AllowanceTopUpComponent } from "@app/core/components/allowance/top-up.component";
// import { AllowanceComponent } from "@app/core/components/allowance/allowance.component";
// import { ViewPotComponent } from "./components/dashboard/viewpot.component";
// import { BulkCategoryComponent } from "@app/core/components/employee/bulk-category.component";
// import { TransferPotComponent } from "./components/dashboard/transferpot.component";
// import { TransferFromToComponent } from "./components/dashboard/transferfromto.component";
// import { PotCongratsComponent } from "./components/dashboard/potcongrats.component";
// import { GoalComponent } from "./components/dashboard/goal.component";
// import { ClaimComponent } from "./components/claim/claim.component";
// import { ClaimApprovedComponent } from "./components/claim/claim-approved.component";
// import { ClaimDetailsComponent } from "./components/claim/claim-details.component";
// import { ClaimRejectedComponent } from "./components/claim/claim-rejected.component";
// import { SpendComponent } from "./components/spend/spend.component";
// import { CardComponent } from "./components/card/card.component";
// import { TopupApprovalComponent } from "./components/company/topup-approval.component";
// import { KopprSignUpComponent } from "./components/login/sign-up/signup.component";
// import { SignUpInnerComponent } from "./components/company/sign-up-inner.component";
// import { SignUpComponent } from "./components/company/sign-up.component";
import { PlaceholderComponent } from "./components/placeholder/placeholder.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";
import { NavComponent } from "./components/nav/nav.component";
import { SignInComponent } from "./components/login/sign-in/signin.component";
import { DistributorComponent } from "./components/distributor/distributor.component";
import { SuperDistributorComponent } from "./components/super-distributor/super-distributor.component";
import { AddSuperDistributorComponent } from "./components/super-distributor/add-super-distributor.component";
import { AddDistributorComponent } from "./components/distributor/add-distributor.component";
import { RetailerComponent } from "./components/retailer/retailer.component";
import { AddRetailerComponent } from "./components/retailer/add-retailer.component";
import { LedgersComponent } from "./components/ledgers/ledgers.component";
import { EarningsComponent } from "./components/earnings/earnings.component";
import { TransactionsComponent } from "./components/transactions/transactions.component";
import { ViewTransactionsComponent } from "./components/transactions/view-transactions.component";
import { WalletLoadRequestComponent } from "./components/wallet-load-request/wallet-load-request.component";
import { ViewLoadRequestsComponent } from "./components/wallet-load-request/view-load-requests.component";
import { WalletTopUpComponent } from "./components/wallet-top-up/wallet-top-up.component";
import { PaymentsComponent } from "./components/payments/payments.component";
import { ForgotPasswordComponent } from "./components/login/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./components/login/verify-email/verify-email.component";
import { SetPasswordComponent } from "./components/login/set-password/set-password.component";
import { UserAccountComponent } from "./components/user-account/user-account.component";
import { EditAccountComponent } from "./components/user-account/edit-account.component";
import { CommissionsComponent } from "./components/commissions/commissions.component";
import { LoyaltyComponent } from "./components/loyalty/loyalty.component";
import { AddMarginsComponent } from "./components/margins/add-margins/add-margins.component";
import { MarginsComponent } from "./components/margins/margins.component";
import { rootStates } from "./ngxs-store/ngxs-state";

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  imports: [
    // AngularFireModule.initializeApp(environment.firebase),
    // The Angular Material module must be imported after Angular's BrowserModule, as the import order matters for NgModules.
    AngularMaterialModule,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    kopprComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    DynamicFormsModule,
    DynamicFormsMaterialUIModule,
    NzBreadCrumbModule,
    NgZorroAntdModule,
    NzDropDownModule,
    NzSelectModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    NzLayoutModule,
    NzTableModule,
    NzCardModule,
    NzIconModule,
    NzModalModule,
    NgOtpInputModule,
    NzTabsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    Ng2SearchPipeModule,
    ChartsModule,
    UtilsModule.forRoot(environment),
    NgxSpinnerModule,
    RouterModule, // There is no directive with "exportAs" set to "routerLinkActive ...
    NgxsModule.forRoot(rootStates, {
      developmentMode: !environment.production,
    }),
    NgxsResetPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    DatePipe,
    CurrencyPipe,
  ],
  declarations: [
    // SalaryComponent,
    // AddEmployeeComponent,
    // BulkUploadComponent,
    // BulkUploadSuccessComponent,
    // BulkCategoryComponent,
    // CompanyDetailsComponent,
    // BankDetailsComponent,
    // SelectPlanComponent,
    // PlanPaymentComponent,
    // PaySalaryComponent,
    // ConfirmSalaryPaymentComponent,
    // SalaryPaymentResponseComponent,
    // TopUpPaymentResponseComponent,
    // TopUpPaymentComponent,
    // TopUpComponent,
    // AddNewUserComponent,
    // UserComponent,
    // KopprAccountDetailsComponent,
    // UserDetailsComponent,
    // PaySalaryComponent,
    // ConfirmSalaryPaymentComponent,
    // SalaryPaymentResponseComponent,
    // TopUpPaymentResponseComponent,
    // TopUpPaymentComponent,
    // TopUpComponent,
    // PaySalaryComponent,
    // ConfirmSalaryPaymentComponent,
    // SalaryPaymentResponseComponent,
    // TopUpPaymentResponseComponent,
    // TopUpPaymentComponent,
    // TopUpComponent,
    // EmployeeAddTypeSelectionComponent,
    // ListComponent,
    // TransferPotComponent,
    // TransferFromToComponent,
    // PotCongratsComponent,
    // GoalComponent,
    // SpendComponent,
    // CardComponent,
    // ClaimComponent,
    // ClaimApprovedComponent,
    // ClaimDetailsComponent,
    // ClaimRejectedComponent,
    // ViewPotComponent,
    // PayAllowanceComponent,
    // ConfirmAllowancePaymentComponent,
    // AllowancePaymentResponseComponent,
    // AllowanceTopUpPaymentResponseComponent,
    // AllowanceTopUpPaymentComponent,
    // AllowanceTopUpComponent,
    // AllowanceComponent,
    // DepositComponent,
    // TopupApprovalComponent,
    // CompanyListComponent,
    // SignUpInnerComponent,
    // SignUpComponent,
    // KopprSignUpComponent,
    PlaceholderComponent,
    DashboardComponent,
    NavigationBarComponent,
    NavComponent,
    SignInComponent,
    ModalComponent,
    FilterPipeByField,
    DistributorComponent,
    AddDistributorComponent,
    RetailerComponent,
    AddRetailerComponent,
    LedgersComponent,
    EarningsComponent,
    TransactionsComponent,
    ViewTransactionsComponent,
    WalletLoadRequestComponent,
    WalletTopUpComponent,
    PaymentsComponent,
    ForgotPasswordComponent,
    SuperDistributorComponent,
    AddSuperDistributorComponent,
    VerifyEmailComponent,
    SetPasswordComponent,
    UserAccountComponent,
    EditAccountComponent,
    LoyaltyComponent,
    CommissionsComponent,
    MarginsComponent,
    AddMarginsComponent,
    ViewLoadRequestsComponent,
  ],
  exports: [
    // SalaryComponent,
    // AddEmployeeComponent,
    // BulkUploadComponent,
    // BulkUploadSuccessComponent,
    // ListComponent,
    // CompanyDetailsComponent,
    // BankDetailsComponent,
    // SelectPlanComponent,
    // PaySalaryComponent,
    // ConfirmSalaryPaymentComponent,
    // SalaryPaymentResponseComponent,
    // TopUpPaymentResponseComponent,
    // TopUpPaymentComponent,
    // TopUpComponent,
    // AddNewUserComponent,
    // UserComponent,
    // KopprAccountDetailsComponent,
    // UserDetailsComponent,
    // EmployeeAddTypeSelectionComponent,
    // TransferPotComponent,
    // TransferFromToComponent,
    // PotCongratsComponent,
    // GoalComponent,
    // SpendComponent,
    // CardComponent,
    // ClaimComponent,
    // ClaimDetailsComponent,
    // ClaimApprovedComponent,
    // ClaimRejectedComponent,
    // ViewPotComponent,
    // PayAllowanceComponent,
    // ConfirmAllowancePaymentComponent,
    // AllowancePaymentResponseComponent,
    // AllowanceTopUpPaymentResponseComponent,
    // AllowanceTopUpPaymentComponent,
    // AllowanceTopUpComponent,
    // AllowanceComponent,
    // DepositComponent,
    // TopupApprovalComponent,
    // CompanyListComponent,
    // SignUpInnerComponent,
    // SignUpComponent,
    // KopprSignUpComponent,
    PlaceholderComponent,
    DashboardComponent,
    VerifyEmailComponent,
    NavigationBarComponent,
    NavComponent,
    SignInComponent,
    ModalComponent,
    DistributorComponent,
    AddDistributorComponent,
    RetailerComponent,
    AddRetailerComponent,
    LedgersComponent,
    EarningsComponent,
    TransactionsComponent,
    ViewTransactionsComponent,
    WalletLoadRequestComponent,
    WalletTopUpComponent,
    PaymentsComponent,
    ForgotPasswordComponent,
    SuperDistributorComponent,
    AddSuperDistributorComponent,
    VerifyEmailComponent,
    SetPasswordComponent,
    UserAccountComponent,
    LoyaltyComponent,
    CommissionsComponent,
    MarginsComponent,
    ViewLoadRequestsComponent,
  ],
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    private translate: TranslateService,
    private logger: LoggerService
  ) {
    this.logger.info("Core Module initialised");

    // 'en-gb' -> 'en'
    const defaultLanguage = environment.defaultLanguage.split("-")[0];

    this.logger.info("Default Language: " + defaultLanguage);
    this.logger.info("Local: " + environment.defaultLanguage.split("-")[1]);

    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);

    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }
}

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

// https://stackoverflow.com/questions/50860898/angular-6-services-providedin-root-vs-coremodule

// https://github.com/angular/angular/issues/29848 -> Keep CoreModule as preferred location for app-wide single-use components

//
// Firebase Hosting
//

// https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md

// import { AngularFireModule } from '@angular/fire';
