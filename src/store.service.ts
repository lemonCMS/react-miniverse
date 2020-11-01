import {
    Observable, of,
    ReplaySubject, Subject, throwError,
} from "rxjs";
import {
    distinctUntilChanged,
    filter, map,
    switchMap,
    takeUntil,
    tap
} from "rxjs/operators";
import {
    StoreCacheInterface,
    DataInterface,
    StoreServiceInterface,
    ResourceObservableInterface,
    ParamsInterface
} from "./interfaces";
import {deepEqual} from "fast-equals";

export default class StoreService implements StoreServiceInterface {
    private loaded = false;
    private data: DataInterface = {}

    public set<T = any>(namespace: string, key: string, params?: ParamsInterface, value?: T): ReplaySubject<ResourceObservableInterface> {

        if (!this.data[namespace]) {
            this.data[namespace] = {};
        }

        if (!this.data[namespace][key]) {
            this.data[namespace][key] = {
                static: value,
                params: params,
                value: new ReplaySubject<T | undefined>(1)
            }
        }

        this.data[namespace][key].static = value;
        this.data[namespace][key].params = params;
        this.data[namespace][key].value.next({
            value,
            params
        });
        return this.data[namespace][key].value;
    }

    public has(namespace: string, key: string, params?: ParamsInterface, value?: any): boolean {

        if (typeof params === 'undefined' && typeof value === 'undefined') {
            return this.data[namespace]
                && this.data[namespace][key]
                && typeof this.data[namespace][key].static !== 'undefined'
                && this.data[namespace][key].static !== null;

        }

        if (typeof params === 'undefined' && typeof value !== 'undefined') {
            return this.data[namespace]
                && this.data[namespace][key]
                && this.data[namespace][key].static !== null
                && deepEqual(this.data[namespace][key].static, value);
        }

        if (typeof params !== 'undefined' && typeof value === 'undefined') {
            return this.data[namespace]
                && this.data[namespace][key]
                && this.data[namespace][key].static !== null
                && deepEqual(this.data[namespace][key].params, params);
        }

        return (
            this.data[namespace]
            && this.data[namespace][key]
            && this.data[namespace][key].static !== null
            && deepEqual(this.data[namespace][key].params, params)
            && deepEqual(this.data[namespace][key].static, value));
    }

    public getStatic<T>(namespace: string, key: string, params?: ParamsInterface, defaultValue?: any): T {
        if (this.has(namespace, key, params)) {
            return this.data[namespace][key].static;
        }

        this.set(namespace, key, params, defaultValue);
        return defaultValue;
    }

    public get<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<ResourceObservableInterface<T>> {
        return this.getInternal<T>(namespace, key, defaultValue)
            .pipe(filter((result: ResourceObservableInterface) => (typeof result !== 'undefined' && typeof result.value !== 'undefined')));
    }

    public getValue<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<T> {
        return this.getInternal<T>(namespace, key, defaultValue)
            .pipe(
                filter((result: ResourceObservableInterface) => (typeof result !== 'undefined' && typeof result.value !== 'undefined')),
                map((result) => result.value)
            );
    }

    public getRaw<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<ResourceObservableInterface<T>> {
        return this.getInternal<T>(namespace, key, defaultValue);
    }

    public clear(namespace: string, key: string): void {
        this.set(namespace, key, undefined, undefined);
    }

    private getInternal<T>(namespace: string, key: string, defaultValue: any = undefined): Observable<ResourceObservableInterface<T>> {
        if (!this.has(namespace, key)) {
            this.set(namespace, key, undefined, defaultValue);
        }

        return this.data[namespace][key].value
            .pipe(
                distinctUntilChanged((prev, curr) => deepEqual(prev, curr))
            );
    }

    public completeAll() {
        Object.keys(this.data).forEach((namespace: string) => {
            Object.keys(this.data[namespace]).forEach((key: string) => {
                this.data[namespace][key].value.complete();
            })
        });
    }

    public import(data: { [key: string]: any }): void {
        if (typeof window === 'undefined') {
            this.loaded = false;
            this.completeAll();
            this.data = {};
        }

        if (this.loaded || typeof data === 'undefined') {
            return;
        }

        Object.keys(data).forEach((namespaceKey: string) => {
            const [namespace, key] = namespaceKey.split('.');
            this.set(namespace, key, data[namespaceKey].params, data[namespaceKey].value);
        });

        this.loaded = true;
    }

    public async export(): Promise<any> {
        const data: any = {};
        Object.keys(this.data).forEach((namespace: string) => {
            Object.keys(this.data[namespace]).forEach((key: string) => {
                const name = `${namespace}.${key}`;
                data[name] = {value: this.data[namespace][key].static, params: this.data[namespace][key].params};
            })
        })

        return new Promise(resolve => resolve(data));
    }

    public cache<T = any>(namespace: string, key: string, params: any = undefined, resource?: Observable<any>): StoreCacheInterface<T> {
        return {
            'hot': (defaultValue?: any): Observable<T> =>
                this.get(namespace, key, defaultValue)
                    .pipe(
                        map((result: ResourceObservableInterface<T>): T => (result.value))
                    ),
            'isLoaded': (): boolean => this.has(namespace, key, params),
            'cold': (defaultValue?: any): T => this.getStatic(namespace, key, defaultValue),
            'load': (): Observable<T> => this.toObservable(namespace, key, params, resource),
            'toPromise': (): Promise<T> => this.toPromise(namespace, key, params, resource),
            'clear': (): void => this.clear(namespace, key),
            'refresh': (): Observable<T> => {
                this.clear(namespace, key);
                return this.toObservable(namespace, key, params, resource)
            },
        }
    }

    private toObservable<T = any>(namespace: string, key: string, params: any = undefined, resource?: Observable<T>) {
        if (!resource) {
            return throwError('Resource is required with the use of `toObservable`')
        }

        return this.getRaw(namespace, key)
            .pipe(
                switchMap((result) => {
                    if (!!result && !!result.value && deepEqual(result.params, params)) {
                        return of(result.value);
                    }
                    return resource;
                })
            )
            .pipe(
                tap((data: T) => {
                    this.set(namespace, key, params, data);
                })
            );
    }

    private toPromise<T = any>(namespace: string, key: string, params: any = undefined, resource?: Observable<T>): Promise<T> {
        if (!resource) {
            return throwError('Resource is required with the use of `toPromise`').toPromise();
        }

        const close$ = new Subject();

        return new Observable<T>(subscriber$ => {
            this.getRaw(namespace, key)
                .pipe(
                    takeUntil(close$),
                    switchMap((result) => {
                        if (!!result.value && deepEqual(result.params, params)) {
                            return of(result.value);
                        }

                        return resource
                            .pipe(
                                tap((data: any) => {
                                    this.set(namespace, key, params, data);
                                })
                            );
                    }))
                .subscribe(
                    (data: any) => {
                        subscriber$.next(data);
                        subscriber$.complete();
                    },
                    error => subscriber$.error(error));
        })
            .pipe(
                tap(() => {
                    close$.next();
                    close$.complete();
                }))
            .toPromise();
    }
}
