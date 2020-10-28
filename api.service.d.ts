import { AxiosInstance } from "axios";
import CookiesService from "./cookies.service";
import { Observable } from "rxjs";
import { ApiServiceInterface, DataInterface, ParamsInterface, RequestOptionsInterface } from "./interfaces";
export default class ApiService implements ApiServiceInterface {
    private cookiesService;
    protected api: AxiosInstance;
    private tokenCookie;
    private cancelTokens;
    constructor(cookiesService: CookiesService);
    private setTokenInterceptor;
    get<T = any>(url: string, params?: ParamsInterface, options?: RequestOptionsInterface): Observable<T>;
    post<T = any>(url: string, data?: DataInterface, options?: RequestOptionsInterface): Observable<T>;
    put<T = any>(url: string, data?: DataInterface, options?: RequestOptionsInterface): Observable<T>;
    patch<T = any>(url: string, data?: DataInterface, options?: RequestOptionsInterface): Observable<T>;
    delete<T = any>(url: string, data?: DataInterface): Observable<T>;
    private getCancelToken;
    private prepareUrl;
}
