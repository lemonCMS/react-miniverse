import { Observable, ReplaySubject } from "rxjs";
import { StoreCacheInterface, StoreServiceInterface } from "./interfaces";
export default class StoreService implements StoreServiceInterface {
    private loaded;
    private data;
    set<T = any>(namespace: string, key: string, params?: any, value?: T): ReplaySubject<T | undefined>;
    has(namespace: string, key: string, params?: any): boolean;
    getStatic<T>(namespace: string, key: string, defaultValue?: any): T;
    get<T = any>(namespace: string, key: string, defaultValue?: any): Observable<T>;
    getRaw<T = any>(namespace: string, key: string, defaultValue?: any): Observable<T>;
    clear(namespace: string, key: string): void;
    private getInternal;
    import(data: {
        [key: string]: any;
    }): void;
    export(): Promise<any>;
    cache<T = any>(namespace: string, key: string, params?: any, resource?: Observable<any>): StoreCacheInterface<T>;
    private toObservable;
    private toPromise;
}
