import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "auth";

import { DashboardComponent } from "@app/core/components/dashboard/dashboard.component";
import { SignInComponent } from "@app/core/components/login/sign-in/signin.component";
import { KopprSignUpComponent } from "@app/core/components/login/sign-up/signup.component";
import { SignUpInnerComponent } from "@app/core/components/company/sign-up-inner.component";
import { SignUpComponent } from "@app/core/components/company/sign-up.component";
// import { AddEmployeeComponent } from "@app/core/components/employee/add-employee.component";
// import { BulkUploadComponent } from "@app/core/components/employee/bulk-upload.component";
// import { BulkCategoryComponent } from "@app/core/components/employee/bulk-category.component";
// import { BulkUploadSuccessComponent } from "@app/core/components/employee/bulk-upload-success.component";
// import { CompanyDetailsComponent } from "@app/core/components/company/company-details.component";
// import { BankDetailsComponent } from "@app/core/components/company/bank-details.component";
// import { SelectPlanComponent } from "@app/core/components/company/select-plan.component";
// import { PlanPaymentComponent } from "@app/core/components/company/plan-payment.component";

// import { PaySalaryComponent } from "@app/core/components/salary/pay-salary.component";
// import { ConfirmSalaryPaymentComponent } from "@app/core/components/salary/confirm-salary-payment.component";
// import { SalaryPaymentResponseComponent } from "@app/core/components/salary/salary-payment-response.component";
// import { TopUpPaymentResponseComponent } from "@app/core/components/salary/top-up-payment-response.component";
// import { TopUpPaymentComponent } from "@app/core/components/salary/top-up-payment.component";
// import { TopUpComponent } from "@app/core/components/salary/top-up.component";

// import { PayAllowanceComponent } from "@app/core/components/allowance/pay-allowance.component";
// import { ConfirmAllowancePaymentComponent } from "@app/core/components/allowance/confirm-allowance-payment.component";
// import { AllowancePaymentResponseComponent } from "@app/core/components/allowance/allowance-payment-response.component";
// import { AllowanceTopUpPaymentResponseComponent } from "@app/core/components/allowance/top-up-payment-response.component";
// import { AllowanceTopUpPaymentComponent } from "@app/core/components/allowance/top-up-payment.component";
// import { AllowanceTopUpComponent } from "@app/core/components/allowance/top-up.component";
// import { AllowanceComponent } from "@app/core/components/allowance/allowance.component";
// import { KopprAccountDetailsComponent } from "@app/core/components/account/koppr-account-details.component";
// import { UserComponent } from "@app/core/components/account/user.component";
// import { AddNewUserComponent } from "@app/core/components/account/addnewuser.component";
// import { UserDetailsComponent } from "@app/core/components/account/userdetails.component";

// import { ViewPotComponent } from "@app/core/components/dashboard/viewpot.component";
// import { TransferPotComponent } from "@app/core/components/dashboard/transferpot.component";
// import { SalaryComponent } from "@app/core/components/salary/salary.component";

// import { GoalComponent } from "@app/core/components/dashboard/goal.component";

// import { ClaimComponent } from "@app/core/components/claim/claim.component";
// import { ClaimDetailsComponent } from "@app/core/components/claim/claim-details.component";
// import { ClaimApprovedComponent } from "@app/core/components/claim/claim-approved.component";
// import { ClaimRejectedComponent } from "@app/core/components/claim/claim-rejected.component";
// import { SpendComponent } from "@app/core/components/spend/spend.component";
// import { CardComponent } from "@app/core/components/card/card.component";
// import { TransferFromToComponent } from "@app/core/components/dashboard/transferfromto.component";
// import { PotCongratsComponent } from "@app/core/components/dashboard/potcongrats.component";
// import { EmployeeAddTypeSelectionComponent } from "@app/core/components/employee/employee-add-type-selection.component";
// import { ListComponent } from "@app/core/components/employee/list.component";
// import { CompanyListComponent } from "./core/components/company/companylist.component";
// import { DepositComponent } from "./core/components/company/deposit.component";
// import { TopupApprovalComponent } from "./core/components/company/topup-approval.component";

import { SuperDistributorComponent } from "@app/core/components/super-distributor/super-distributor.component";
import { AddSuperDistributorComponent } from "@app/core/components/super-distributor/add-super-distributor.component";
import { DistributorComponent } from "@app/core/components/distributor/distributor.component";
import { AddDistributorComponent } from "@app/core/components/distributor/add-distributor.component";
import { RetailerComponent } from "@app/core/components/retailer/retailer.component";
import { AddRetailerComponent } from "@app/core/components/retailer/add-retailer.component";
import { LedgersComponent } from "@app/core/components/ledgers/ledgers.component";
import { EarningsComponent } from "@app/core/components/earnings/earnings.component";
import { TransactionsComponent } from "@app/core/components/transactions/transactions.component";
import { WalletLoadRequestComponent } from "@app/core/components/wallet-load-request/wallet-load-request.component";
import { ViewLoadRequestsComponent } from "@app/core/components/wallet-load-request/view-load-requests.component";
import { WalletTopUpComponent } from "@app/core/components/wallet-top-up/wallet-top-up.component";
import { PaymentsComponent } from "@app/core/components/payments/payments.component";
import { ForgotPasswordComponent } from "@app/core/components/login/forgot-password/forgot-password.component";
import { SetPasswordComponent } from "@app/core/components/login/set-password/set-password.component";
import { VerifyEmailComponent } from "@app/core/components/login/verify-email/verify-email.component";
import { UserAccountComponent } from "@app/core/components/user-account/user-account.component";
import { EditAccountComponent } from "@app/core/components/user-account/edit-account.component";
import { LoyaltyComponent } from "@app/core/components/loyalty/loyalty.component";
import { CommissionsComponent } from "@app/core/components/commissions/commissions.component";
import { MarginsComponent } from "./core/components/margins/margins.component";
import { AddMarginsComponent } from "./core/components/margins/add-margins/add-margins.component";

export enum menuType {
  initialSetup = 1,
  userRole = 2,
  normal = 3,
  siginin = 4,
}

const routes: Routes = [
  //
  // https://angular.io/guide/lazy-loading-ngmodules#routes-at-the-app-level
  //

  // ng build --prod --source-map
  //
  // ERROR in ./src/app/app-routing.module.ts
  // Module not found: Error: Can't resolve './../../dist/sales/lib/sales.module.d.ngfactory' in
  //   '/Users/robferguson/workspace/Robinyo/koppr/src/app'

  // {
  //   path: 'sales',
  //   loadChildren: () => import('sales').then(lib => lib.SalesModule)
  // },

  //
  // Reference the lib wrapper modules using a relative path
  //
  {
    path: "my-account",
    component: UserAccountComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "edit-account-details",
    component: EditAccountComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "distributor",
    component: DistributorComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "super-distributor",
    component: SuperDistributorComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "super-distributor/add",
    component: AddSuperDistributorComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "super-distributor/add/:id",
    component: AddSuperDistributorComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "distributor/add",
    component: AddDistributorComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "distributor/add/:id",
    component: AddDistributorComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "retailer",
    component: RetailerComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "retailer/add",
    component: AddRetailerComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "retailer/add/:id",
    component: AddRetailerComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "ledgers",
    component: LedgersComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "earnings",
    component: EarningsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "loyalty",
    component: LoyaltyComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "commissions",
    component: CommissionsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "transactions",
    component: TransactionsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "wallet-load-request",
    component: WalletLoadRequestComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "view-load-request/:id",
    component: ViewLoadRequestsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "margins",
    component: MarginsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "margins/add",
    component: AddMarginsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "margins/add/:id",
    component: AddMarginsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "wallet-top-up",
    component: WalletTopUpComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "payments",
    component: PaymentsComponent,
    data: { menuType: menuType.normal },
  },
  {
    path: "signup",
    component: KopprSignUpComponent,
    data: { menuType: 4 },
  },
  {
    path: "account-update",
    component: SignUpInnerComponent,
    data: { menuType: 4 },
  },
  {
    path: "signin",
    component: SignInComponent,
    data: { menuType: menuType.siginin },
  },
  {
    path: "forgot-password/:token",
    component: SetPasswordComponent,
    data: { menuType: menuType.siginin },
  },
  {
    path: "new-password/:token",
    component: SetPasswordComponent,
    data: { menuType: menuType.siginin },
  },
  {
    path: "verify-email/:token",
    component: VerifyEmailComponent,
    data: { menuType: menuType.siginin },
  },
  {
    path: "forgot-password",
    component: ForgotPasswordComponent,
    data: { menuType: menuType.siginin },
  },
  {
    path: "signup",
    component: SignUpComponent,
    data: { menuType: menuType.siginin },
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    data: { menuType: menuType.normal },
  },
  // {
  //   path: "dashboard/:company_id",
  //   component: DashboardComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/add",
  //   component: AddEmployeeComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/add/:employeeid/:id",
  //   component: AddEmployeeComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/list/add-type-selection",
  //   component: EmployeeAddTypeSelectionComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/bulk",
  //   component: BulkUploadComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/bulk/category",
  //   component: BulkCategoryComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/list/bulkuploadsuccess",
  //   component: BulkUploadSuccessComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "employee/list",
  //   component: ListComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "company/signup",
  //   component: SignUpComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "company/listing",
  //   component: CompanyListComponent,
  //   data: { menuType: menuType.initialSetup }
  // },

  // {
  //   path: "company/listing/:company_id",
  //   component: CompanyListComponent,
  //   data: { menuType: menuType.initialSetup }
  // },
  // {
  //   path: "company/companydetails",
  //   component: CompanyDetailsComponent,
  //   data: { menuType: menuType.initialSetup }
  // },
  // {
  //   path: "company/bankdetails",
  //   component: BankDetailsComponent,
  //   data: { menuType: menuType.initialSetup }
  // },
  // {
  //   path: "company/selectplan",
  //   component: SelectPlanComponent,
  //   data: { menuType: menuType.initialSetup }
  // },
  // {
  //   path: "company/deposit",
  //   component: DepositComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "company/topups/:company_id",
  //   component: TopupApprovalComponent,
  //   data: { menuType: menuType.initialSetup }
  // },
  // {
  //   path: "company/planpayment",
  //   component: PlanPaymentComponent,
  //   data: { menuType: menuType.initialSetup }
  // },
  // {
  //   path: "account-details/:company_id",
  //   component: KopprAccountDetailsComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "account/user",
  //   component: UserComponent,
  //   data: { menuType: menuType.userRole }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "account/user/addnewuser",
  //   component: AddNewUserComponent,
  //   data: { menuType: menuType.userRole }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "account/user/userdetails",
  //   component: UserDetailsComponent,
  //   data: { menuType: menuType.userRole }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "potcongrats",
  //   component: PotCongratsComponent
  // },
  // {
  //   path: "salary",
  //   component: SalaryComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "salary/pay",
  //   component: PaySalaryComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "salary/confirmsalarypayment",
  //   component: ConfirmSalaryPaymentComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "salary/salarypaymentresponse",
  //   component: SalaryPaymentResponseComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "salary/topuppaymentresponse",
  //   component: TopUpPaymentResponseComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "salary/topuppayment",
  //   component: TopUpPaymentComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "salary/topup",
  //   component: TopUpComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance",
  //   component: AllowanceComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance/pay",
  //   component: PayAllowanceComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance/confirm",
  //   component: ConfirmAllowancePaymentComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance/allowancepaymentresponse",
  //   component: AllowancePaymentResponseComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance/topuppaymentresponse",
  //   component: AllowanceTopUpPaymentResponseComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance/topuppayment",
  //   component: AllowanceTopUpPaymentComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "allowance/topup",
  //   component: AllowanceTopUpComponent,
  //   data: { menuType: menuType.normal }
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "viewpot",
  //   component: ViewPotComponent
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "transfer",
  //   component: TransferPotComponent
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "transferfromto",
  //   component: TransferFromToComponent
  //   // ,
  //   // canActivate: [AuthGuard],
  //   // runGuardsAndResolvers: 'always'
  // },
  // {
  //   path: "goal",
  //   component: GoalComponent,
  //   canActivate: [AuthGuard],
  //   runGuardsAndResolvers: "always"
  // },

  // {
  //   path: "claims",
  //   component: ClaimComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "claims/details/:id",
  //   component: ClaimDetailsComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "claims/details/claimrejected",
  //   component: ClaimRejectedComponent,
  //   data: { menuType: menuType.normal }
  // },
  // {
  //   path: "claims/details/claimapproved",
  //   component: ClaimApprovedComponent,
  //   data: { menuType: menuType.normal }
  // },

  // {
  //   path: "spends",
  //   component: SpendComponent,
  //   canActivate: [AuthGuard],
  //   runGuardsAndResolvers: "always"
  // },

  // {
  //   path: "cards",
  //   component: CardComponent,
  //   canActivate: [AuthGuard],
  //   runGuardsAndResolvers: "always"
  // },
  {
    path: "**",
    redirectTo: "signin",
    data: { menuType: menuType.siginin },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// https://github.com/angular/angular/issues/10981

// https://github.com/tomastrajan/angular-lazy-lib-demo/blob/master/projects/some-app/src/app/app-routing.module.ts

// https://stackoverflow.com/questions/40380726/angular2-router-canactivate-after-logout

/*
{
  path: '',
  loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
},
{
  path: '',
  loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
},
*/

/*

  {
    path: 'sales',
    children: [
      {
        path: '',
        loadChildren: './lazy-loading/flowable-lib-wrapper.module#FlowableLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
      }
    ]
  },

*/

/*

      {
        path: '',
        loadChildren: './lazy-loading/highcharts-lib-wrapper.module#HighchartsLibWrapperModule'
      },

  {
    path: 'sales',
    children: [
      {
        path: '',
        loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
      },
      {
        path: '',
        loadChildren: './lazy-loading/dynamic-forms-lib-wrapper.module#DynamicFormsLibWrapperModule'
      }

    ]
  },

*/

/*

{
  path: 'sales',
  children: [
    {
      path: '',
      loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
    },
    {
      path: 'library-dashboard',
      loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
    },
    {
      path: 'library-dashboard-widgets',
      loadChildren: './lazy-loading/dashboard-widgets-lib-wrapper.module#DashboardWidgetsLibWrapperModule'
    },
    {
      path: 'library-dynamic-forms',
      loadChildren: './lazy-loading/dynamic-forms-lib-wrapper.module#DynamicFormsLibWrapperModule'
    }

  ]
},

{
  path: 'sales',
  loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule'
},

{
  path: 'sales',
  loadChildren: './lazy-loading/sales-lib-wrapper.module#SalesLibWrapperModule',
  children: [
    {
      path: 'library-1',
      loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule'
    }
  ]
},

{
  // path: 'sales/leads',
  path: 'leads',
  component: PlaceholderComponent,
  canActivate: [AuthGuard],
  runGuardsAndResolvers: 'always'
},

{
  // path: 'sales/leads',
  path: 'leads',
  loadChildren: './lazy-loading/dashboard-lib-wrapper.module#DashboardLibWrapperModule',
  component: PlaceholderComponent,
  canActivate: [AuthGuard],
  runGuardsAndResolvers: 'always'
},

*/
