import { Observable, ReplaySubject } from "rxjs";
import { StoreCacheInterface, StoreServiceInterface, ResourceObservableInterface, ParamsInterface } from "./interfaces";
export default class StoreService implements StoreServiceInterface {
    private loaded;
    private data;
    set<T = any>(namespace: string, key: string, params?: ParamsInterface, value?: T): ReplaySubject<ResourceObservableInterface>;
    has(namespace: string, key: string, params?: ParamsInterface, value?: any): boolean;
    getStatic<T>(namespace: string, key: string, params?: ParamsInterface, defaultValue?: any): T;
    get<T = any>(namespace: string, key: string, defaultValue?: any): Observable<ResourceObservableInterface<T>>;
    getValue<T = any>(namespace: string, key: string, defaultValue?: any): Observable<T>;
    getRaw<T = any>(namespace: string, key: string, defaultValue?: any): Observable<ResourceObservableInterface<T>>;
    clear(namespace: string, key: string): void;
    private getInternal;
    completeAll(): void;
    import(data: {
        [key: string]: any;
    }): void;
    export(): Promise<any>;
    cache<T = any>(namespace: string, key: string, params?: any, resource?: Observable<any>): StoreCacheInterface<T>;
    private toObservable;
    private toPromise;
}
