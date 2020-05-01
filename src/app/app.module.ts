import { ErrorHandler, NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";

import { CoreModule } from "./core/core.module";
import { AppComponent } from "./app.component";

import { angularMaterialProviders } from "./providers";

import { environment } from "@env/environment";

//
// Auth libs
//

import { LocalAuthModule, authProviders } from "auth-local";
// import { Auth0AuthModule, authProviders } from 'auth-auth0';
// import { OktaAuthModule, authProviders } from 'auth-okta';

//
// Utils lib
//

import { LoggerService, loggerProviders } from "utils";

import { GlobalErrorHandler } from "./error-handler";
import { HttpErrorInterceptor } from "./core/http-interceptors/error-interceptor";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material";
//
//
// Lazy Loaded Libs -> forRoot()
//
//

import { DynamicFormsModule } from "dynamic-forms";
// import { SalesModule } from 'sales';

//
// AppRoutingModule: https://angular.io/guide/router#routing-module-order
//
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { DynamicFormsMaterialUIModule } from "@ng-dynamic-forms/ui-material";

import { HashLocationStrategy, LocationStrategy } from "@angular/common";

const appearance: MatFormFieldDefaultOptions = {
  appearance: "outline",
};

@NgModule({
  imports: [
    BrowserModule,
    LocalAuthModule,
    // Auth0AuthModule.forRoot(environment),
    // OktaAuthModule.forRoot(environment),
    CoreModule,
    DynamicFormsModule.forRoot(environment),
    // SalesModule,
    AppRoutingModule, // https://angular.io/guide/router#routing-module-order,
    FormsModule,
    ReactiveFormsModule,
    DynamicFormsMaterialUIModule,
  ],
  declarations: [AppComponent],
  providers: [
    loggerProviders,
    authProviders,
    angularMaterialProviders,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private logger: LoggerService) {
    this.logger.info("App Module initialised");
  }
}
