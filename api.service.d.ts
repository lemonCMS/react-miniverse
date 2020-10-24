import { AxiosInstance } from "axios";
import CookiesService from "./cookies.service";
import { Observable } from "rxjs";
import { ApiServiceInterface, RequestOptionsInterface } from "./interfaces";
export default class ApiService implements ApiServiceInterface {
    private cookiesService;
    protected api: AxiosInstance;
    private tokenCookie;
    constructor(cookiesService: CookiesService);
    private setTokenInterceptor;
    get<T = any>(url: string, params?: any, options?: RequestOptionsInterface): Observable<T>;
    post<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T>;
    put<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T>;
    patch<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T>;
    delete<T = any>(url: string, data?: any): Observable<T>;
    private getCancelToken;
    private prepareUrl;
}
