import { Observable, ReplaySubject } from "rxjs";
import { Request } from "express";
import { CookieGetOptions, CookieSetOptions } from "universal-cookie";
export interface StoreCacheInterface<T = any> {
    hot: () => Observable<T>;
    isLoaded: () => boolean;
    cold: (defaultValue?: any) => T;
    load: () => Observable<T>;
    toPromise: () => Promise<T>;
}
export interface NameSpaceInterface {
    [key: string]: {
        params: string;
        value: ReplaySubject<any>;
        static: any;
    };
}
export interface DataInterface {
    [key: string]: NameSpaceInterface;
}
export interface StoreServiceInterface {
    set<T = any>(namespace: string, key: string, params?: any, value?: T): ReplaySubject<T | undefined>;
    has(namespace: string, key: string, params?: any): boolean;
    getStatic<T>(namespace: string, key: string, defaultValue?: any): T;
    get<T = any>(namespace: string, key: string, defaultValue?: any): Observable<T>;
    getRaw<T = any>(namespace: string, key: string, defaultValue?: any): Observable<T>;
    clear(namespace: string, key: string): void;
    import(data: {
        [key: string]: any;
    }): void;
    export(): Promise<any>;
    cache<T = any>(namespace: string, key: string, params: any, resource?: Observable<any>): StoreCacheInterface<T>;
}
export interface RequestOptionsInterface {
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
    withReq(req: Request): void;
    get(name: string, options?: CookieGetOptions | undefined): string;
    set(name: string, value: any, options?: CookieSetOptions): void;
    remove(name: string, options?: CookieSetOptions): void;
}
export interface UseColdOrHotInterface {
    <T = any>(resource: StoreCacheInterface<T>): T;
}
export interface UseColdOrLoadInterface {
    <T = any>(resource: StoreCacheInterface<T>): T;
}
