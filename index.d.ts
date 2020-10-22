import {Observable} from "rxjs";
import {Request} from "express";
import {CookieGetOptions} from "universal-cookie";

export interface StoreCacheInterface<T = any> {
    hot: () => Observable<T>;
    has: (params?: any) => boolean;
    cold: (defaultValue?: any) => T;
    load: () => Observable<T>;
    toPromise: () => Promise<T>;
}

export interface NameSpaceInterface {
    [key: string]: {
        params: string;
        value: ReplaySubject<any>;
        static: any;
    }
}

export interface DataInterface {
    [key: string]: NameSpaceInterface;
}

export interface StoreServiceInterface {
    set<T = any>(namespace: string, key: string, params?: any, value?: any);

    has(namespace: string, key: string, params: any = undefined): boolean;

    getStatic<T>(namespace: string, key: string, defaultValue: any = undefined): T;

    get<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<T>;

    getRaw<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<T>;

    clear(namespace: string, key: string): void;

    import(data: { [key: string]: any });

    export(): Promise<any>;

    cache<T = any>(namespace: string, key: string, params: any = undefined, resource?: Observable<any>): StoreCacheInterface<T>;
}

interface RequestOptionsInterface {
    [propName: string]: any;
}

export interface ApiServiceInterface {
    get<T = any>(url: string, params?: any, options?: RequestOptionsInterface): Observable<T>;

    post<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T>;

    put<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T>;

    patch<T = any>(url: string, data?: any, options?: RequestOptionsInterface): Observable<T>;

    delete<T = any>(url: string, data?: any): Observable<T>;
}

export interface CookiesServiceInterface {
    withReq(req: Request);

    get(name: string, options?: CookieGetOptions | undefined): string;

    set(name: string, value: any, options?: CookieSetOptions);

    remove(name: string, options?: CookieSetOptions);
}

export interface UseColdOrHotInterface {
    <T = any>(resource: StoreCacheInterface<T>): T
}

declare module "react-miniverse" {
    export const StoreService: StoreServiceInterface;
    export const ApiBaseService: ApiServiceInterface;
    export const CookiesService: CookiesServiceInterface;
    export const useColdOrHot: UseColdOrHotInterface;
}