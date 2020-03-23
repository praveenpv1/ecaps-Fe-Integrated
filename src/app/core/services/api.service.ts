import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { ModelFactory, MODEL_PATHS, SessionChallenge } from "pk-client";
import { AuthService } from "auth";
import * as _ from "lodash";
import { mockData } from "./mock.service";
import { environment } from "@env/environment";

const BASE_URL = "http://159.89.168.255:5000/";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    base_url = `${environment.apiBaseURL}${environment.restEndPoint}`;
    mf: any;
    constructor(
        private httpClient: HttpClient,
        private authService: AuthService
    ) {
        // this.mf = new ModelFactory({
        //     api_base_url: this.base_url,
        //     token: this.authService.getAccessToken()
        // });
    }

    // public getMFObject() {
    //     return new ModelFactory({
    //         api_base_url: this.base_url,
    //         token: this.authService.getAccessToken()
    //     });
    // }

    // public async login(params: { email: string; password: string }) {
    //   let sc = new SessionChallenge(this.base_url, params.email, params.password);
    //   return await sc.login();
    // }

    public login(params: {
        email: string;
        password: string;
    }): Observable<Object> {
        const url = `${BASE_URL}main/auth/sign-in`;
        // const headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});
        const body = new HttpParams()
            .set("email", params.email)
            .set("password", params.password);

        return this.httpClient
            .post<Object>(url, body.toString(), {
                headers: new HttpHeaders().set(
                    "Content-Type",
                    "application/x-www-form-urlencoded"
                )
            })
            .pipe(retry(2), catchError(this.handleError));
    }

    public async get(path: string, url: string, params: object = {}) {
        return null;
    }

    public async post(path: string, params: object): Promise<Object> {
        return null;
    }

    public async put(
        path: string,
        url: string,
        params: object
    ): Promise<Object> {
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
            token: this.authService.getAccessToken()
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
            token: this.authService.getAccessToken()
        });
        if (!resolveMockData) {
            return await mf.gqlclient(path).mutation(url, params, returnData);
        } else {
            return await this.resolveMockPromise(mockPath);
        }
    }

    async resolveMockPromise(path: string) {
        return await new Promise(resolve => resolve(_.get(mockData, path)));
    }
}
