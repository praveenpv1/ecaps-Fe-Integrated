import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ModelFactory, MODEL_PATHS, SessionChallenge } from "pk-client";
import { AuthService } from "auth";
import * as _ from "lodash";
import { mockData } from "./mock.service";
import { environment } from "@env/environment";

const BASE_URL = "http://159.89.168.255:5000";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  base_url = `${environment.apiBaseURL}${environment.restEndPoint}`;
  mf: any;
  token: string = _.isEmpty(this.authService.getAccessToken())
    ? ""
    : this.authService.getAccessToken();
  userInfo: any = JSON.parse(localStorage.getItem("userData"));
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  public login(params: {
    email: string;
    password: string;
  }): Observable<Object> {
    const url = `${BASE_URL}/main/auth/sign-in`;
    // const body = new HttpParams()
    //   .set("email", params.email)
    //   .set("password", params.password);
    const body = this.stringParams(params).toString();
    return this.httpClient
      .post<Object>(url, body, {
        headers: new HttpHeaders().set(
          "Content-Type",
          "application/x-www-form-urlencoded"
        ),
      })
      .pipe(
        // retry(2),
        catchError(this.handleError)
      );
  }

  public verifyEmail(url: string): Observable<Object> {
    console.log("inverifyemail");

    const getUrl = `${BASE_URL}/${url}`;
    let headers = new HttpHeaders();

    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    return this.httpClient
      .get<Object>(getUrl, {
        headers,
      })
      .pipe(
        // retry(2),
        catchError(this.handleError)
      );
  }

  stringParams(params: object = {}) {
    let body = new HttpParams();
    _.forEach(params, (value, key) => {
      body = body.set(key, value);
    });
    return body;
  }

  public post(url: string, params: object = {}): Observable<Object> {
    const postUrl = `${BASE_URL}/${url}`;
    const body = this.stringParams(params).toString();
    console.log("body", body);
    let headers = new HttpHeaders();
    const token: string = _.isEmpty(this.authService.getAccessToken())
      ? ""
      : this.authService.getAccessToken();
    const tokenType = _.get(this.userInfo, "token_type", "Bearer");

    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    headers = headers.set("Authorization", `${tokenType} ${token}`);

    return this.httpClient
      .post<Object>(postUrl, body, {
        headers,
      })
      .pipe(
        // retry(2),
        catchError(this.handleError)
      );
  }

  //   public get(
  //     url: string,
  //     params: object = { test: 1234, test1: "abc" }
  //   ): Observable<Object> {
  //     const getUrl = `${BASE_URL}/${url}`;
  //     console.log(
  //       "=============this.stringParams(params)======================="
  //     );
  //     console.log(this.stringParams(params));
  //     console.log("====================================");
  //     return this.httpClient
  //       .get<Object>(getUrl, {
  //         headers: new HttpHeaders().set("Content-Type", "application/json"),
  //         params: this.stringParams(params)
  //       })
  //       .pipe(retry(2), catchError(this.handleError));
  //   }

  public get(
    url: string,
    params: object = {},
    isUrlEncoded: boolean = true
  ): Observable<Object> {
    const getUrl = `${BASE_URL}/${url}`;

    const headerType: string = isUrlEncoded
      ? "application/x-www-form-urlencoded"
      : "application/json";
    let headers = new HttpHeaders();
    const isTokenAvailable = _.isEmpty(this.authService.getAccessToken());
    const token: string = isTokenAvailable
      ? ""
      : this.authService.getAccessToken();
    const tokenType = _.get(this.userInfo, "token_type", "Bearer");

    headers = headers.set("Content-Type", headerType);
    if (!_.isEmpty(token)) {
      headers = headers.set("Authorization", `${tokenType} ${token}`);
    }
    return this.httpClient
      .get<Object>(getUrl, {
        params: { ...params },
        headers,
      })
      .pipe(
        // retry(2),
        catchError(this.handleError)
      );
  }

  public async pk_get(
    path: string,
    url: string,
    params: object = {}
  ): Promise<Object> {
    return null;
  }

  public async pk_post(path: string, params: object): Promise<Object> {
    return null;
  }

  public async put(path: string, url: string, params: object): Promise<Object> {
    return null;
  }

  // public put(url: string, params: object): Observable<Object> {
  //   return this.httpClient.put<Object>(url, { ...params }).pipe(
  //     retry(2),
  //     catchError(this.handleError)
  //   );
  // }

  // public delete(url: string, params: object): Observable<Object> {
  //   return this.httpClient.delete<Object>(url, { ...params }).pipe(
  //     retry(2),
  //     catchError(this.handleError)
  //   );
  // }

  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  // GraphQl

  public async query(
    path: string,
    url: string,
    params: object,
    returnData: string,
    resolveMockData: boolean = false,
    mockPath: string = ""
  ): Promise<Object> {
    const mf = new ModelFactory({
      api_base_url: `${environment.apiBaseURL}${environment.gqlEndPoint}`,
      token: this.authService.getAccessToken(),
    });
    if (!resolveMockData) {
      return await mf.gqlclient(path).query(url, params, returnData);
    } else {
      return await this.resolveMockPromise(mockPath);
    }
  }

  public async mutation(
    path: string,
    url: string,
    params: object,
    returnData: string,
    resolveMockData: boolean = false,
    mockPath: string = ""
  ): Promise<Object> {
    const mf = new ModelFactory({
      api_base_url: `${environment.apiBaseURL}${environment.gqlEndPoint}`,
      token: this.authService.getAccessToken(),
    });
    if (!resolveMockData) {
      return await mf.gqlclient(path).mutation(url, params, returnData);
    } else {
      return await this.resolveMockPromise(mockPath);
    }
  }

  async resolveMockPromise(path: string) {
    return await new Promise((resolve) => resolve(_.get(mockData, path)));
  }
}
