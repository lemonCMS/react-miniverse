import qs from "qs";
import axios, {
    AxiosInstance,
    AxiosResponse
} from "axios";
import CookiesService from "./cookies.service";
import {defer, from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ApiServiceInterface, RequestOptionsInterface} from "./interfaces";

export default class ApiService implements ApiServiceInterface {
    protected api: AxiosInstance;
    private tokenCookie = 'token';

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

    get<T = any>(url: string, params?: any, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(options);
            return from(this.api.get(this.prepareUrl(url, params), cancelOptions));
        }).pipe(map((response: AxiosResponse) => (response.data)))
    }

    post<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(options);
            return from(this.api.post(url, data, cancelOptions));
        }).pipe(map((response: AxiosResponse) => (response.data)));
    }

    put<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(options);
            return from(this.api.put(url, data, cancelOptions));
        }).pipe(map((response: AxiosResponse) => (response.data)));
    }

    patch<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T> {
        return defer(() => {
            const {cancelOptions} = this.getCancelToken(options);
            return from(this.api.patch(url, data, cancelOptions));
        }).pipe(map((response: AxiosResponse) => (response.data)));
    }

    delete<T = any>(url: string, data?: any): Observable<T> {
        return defer(() => {
            return from(this.api.delete(url, data));
        }).pipe(map((response: AxiosResponse) => (response.data)));
    }

    private getCancelToken(options?: RequestOptionsInterface) {
        let cancelOptions: RequestOptionsInterface = {};
        if (typeof options !== 'undefined') {
            cancelOptions = options;
        }

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        cancelOptions.cancelToken = source.token;

        return {source, cancelOptions};
    }

    private prepareUrl(url: string, params?: RequestOptionsInterface): string {
        return `${url}?${qs.stringify(params, {encode: true})}`;
    }
}
