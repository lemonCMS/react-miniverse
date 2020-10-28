import qs from "qs";
import axios, {
    AxiosInstance,
    AxiosResponse, CancelTokenSource
} from "axios";
import CookiesService from "./cookies.service";
import {defer, from, Observable} from "rxjs";
import {map, tap} from "rxjs/operators";
import {ApiServiceInterface, DataInterface, ParamsInterface, RequestOptionsInterface} from "./interfaces";

interface CancelTokensInterface {
    [key: string]: CancelTokenSource;
}

export default class ApiService implements ApiServiceInterface {
    protected api: AxiosInstance;
    private tokenCookie = 'token';
    private cancelTokens: CancelTokensInterface = {};

    constructor(private cookiesService: CookiesService) {
        this.api = axios.create();
        this.setTokenInterceptor();
    }

    private setTokenInterceptor() {
        this.api.interceptors.request.use(async (conf: any) => {
            const cookieToken = this.cookiesService.get(this.tokenCookie);
            if (typeof cookieToken !== 'undefined') {
                conf.headers.Authorization = `Bearer ${cookieToken}`;
                return conf;
            }
            return conf;
        });
    }

    get<T = any>(url: string, params?: ParamsInterface, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(url, options);
            return from(this.api.get(this.prepareUrl(url, params), cancelOptions));
        }).pipe(
            tap(() => delete (this.cancelTokens[url])),
            map((response: AxiosResponse) => (response.data)))
    }

    post<T = any>(url: string, data?: DataInterface, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(url, options);
            return from(this.api.post(url, data, cancelOptions));
        }).pipe(
            tap(() => delete (this.cancelTokens[url])),
            map((response: AxiosResponse) => (response.data)));
    }

    put<T = any>(url: string, data?: DataInterface, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(url, options);
            return from(this.api.put(url, data, cancelOptions));
        }).pipe(
            tap(() => delete (this.cancelTokens[url])),
            map((response: AxiosResponse) => (response.data)));
    }

    patch<T = any>(url: string, data?: DataInterface, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(url, options);
            return from(this.api.patch(url, data, cancelOptions));
        }).pipe(
            tap(() => delete (this.cancelTokens[url])),
            map((response: AxiosResponse) => (response.data)));
    }

    delete<T = any>(url: string, data?: DataInterface): Observable<T> {
        return defer(() => {
            return from(this.api.delete(url, data));
        }).pipe(
            tap(() => delete (this.cancelTokens[url])),
            map((response: AxiosResponse) => (response.data)));
    }

    private getCancelToken(url: string, options?: RequestOptionsInterface) {
        if (this.cancelTokens[url]) {
            this.cancelTokens[url].cancel();
        }

        let cancelOptions: RequestOptionsInterface = {};
        if (typeof options !== 'undefined') {
            cancelOptions = options;
        }

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        cancelOptions.cancelToken = source.token;
        this.cancelTokens[url] = source;
        return {source, cancelOptions};
    }

    private prepareUrl(url: string, params?: ParamsInterface): string {
        return `${url}?${qs.stringify(params, {encode: true})}`;
    }
}
