import {
  Observable, of,
  ReplaySubject, Subject, throwError,
} from "rxjs";
import {
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap
} from "rxjs/operators";
import {StoreCacheInterface, DataInterface} from "../index";



export default class StoreService {
  private loaded = false;
  private data: DataInterface = {}

  public set<T = any>(namespace: string, key: string, params?: any, value?: any) {
    if (!this.data[namespace]) {
      this.data[namespace] = {};
    }

    if (!this.data[namespace][key]) {
      this.data[namespace][key] = {
        static: value,
        params: JSON.stringify(params),
        value: new ReplaySubject<T | undefined>(1)
      }
    }

    this.data[namespace][key].static = value;
    this.data[namespace][key].value.next(value);
    return this.data[namespace][key].value;
  }

  public has(namespace: string, key: string, params: any = undefined): boolean {

    if (typeof params === 'undefined') {
      return (this.data[namespace] ? (!!this.data[namespace][key].static) : false);
    }

    return (
      this.data[namespace]
      && this.data[namespace][key]
      && this.data[namespace][key].params === JSON.stringify(params));
  }

  public getStatic<T>(namespace: string, key: string, defaultValue: any = undefined): T {
    if (this.has(namespace, key)) {
      return this.data[namespace][key].static;
    }

    this.set(namespace, key, undefined, defaultValue);
    return defaultValue;
  }

  public get<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<T> {
    return this.getInternal<T>(namespace, key, defaultValue)
      .pipe(filter(value => typeof value !== 'undefined'));
  }

  public getRaw<T = any>(namespace: string, key: string, defaultValue: any = undefined): Observable<T> {
    return this.getInternal<T>(namespace, key, defaultValue);
  }

  public clear(namespace: string, key: string): void {
    this.set(namespace, key, null, null);
  }

  private getInternal<T>(namespace: string, key: string, defaultValue: any = undefined): Observable<T> {
    if (!this.has(namespace, key)) {
      this.set(namespace, key, undefined, defaultValue);
    }

    return this.data[namespace][key].value
      .pipe(
        distinctUntilChanged()
      );
  }

  public import(data: { [key: string]: any }) {

    if (this.loaded || typeof data === 'undefined') {
      return;
    }

    Object.keys(data).forEach((namespaceKey: string) => {
      const [namespace, key] = namespaceKey.split('.');
      this.set(namespace, key, undefined, data[namespaceKey]);
    });

    this.loaded = true;
  }

  public async export(): Promise<any> {
    const data: any = {};
    Object.keys(this.data).forEach((namespace: string) => {
      Object.keys(this.data[namespace]).forEach((key: string) => {
        const name = `${namespace}.${key}`;
        data[name] = this.data[namespace][key].static;
      })
    })

    return new Promise(resolve => resolve(data));
  }

  public cache = <T = any>(namespace: string, key: string, params: any = undefined, resource?: Observable<any>): StoreCacheInterface<T> => {
    return {
      'hot': (defaultValue?: any): Observable<T> => this.get(namespace, key, defaultValue),
      'has': (): boolean => this.has(namespace, key, params),
      'cold': (defaultValue?: any): T => this.getStatic(namespace, key, defaultValue),
      'load': (): Observable<T> => this.toObservable(namespace, key, params, resource),
      'toPromise': (): Promise<T> => this.toPromise(namespace, key, params, resource),
    }
  }

  private toObservable<T = any>(namespace: string, key: string, params: any = undefined, resource?: Observable<T>) {
    if (!resource) {
      return throwError('Resource is required with the use of `toObservable`')
    }

    return this.getRaw(namespace, key)
      .pipe(
        switchMap((result) => {
          if (!!result) {
            return of(result);
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

    let close$ = new Subject();

    return new Observable<T>(subscriber$ => {
      this.getRaw(namespace, key)
        .pipe(
          takeUntil(close$),
          switchMap((result) => {
            if (!!result) {
              return of(result);
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
