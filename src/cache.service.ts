import {AxiosError, AxiosResponse} from "axios";

export interface CacheInterface {
  [key: string]: {
    params: string,
    value: any;
  }
}

export default class CacheService {
  private _cache: CacheInterface = {};

  public isCached(key: string, params: any): boolean {
    if (!this._cache[key]) {
      return false;
    }

    return this._cache[key].params === JSON.stringify(params);
  }

  public set(key: string, params: any, value: any): void {
    this._cache[key] = {
      params: JSON.stringify(params),
      value
    }
  }

  public has(key: string): any | undefined {
    return typeof this._cache[key]?.value !== 'undefined';
  }

  public get(key: string): any | undefined {
    return this._cache[key]?.value || undefined;
  }

  public async fromAxios(key: string, params: any, callback: () => Promise<AxiosResponse>) {
    if (this.isCached(key, params)) {
      return this.get(key);
    }
    let value: any = undefined;
    await callback().then((result: AxiosResponse) => value = result.data).catch(this.log)
    this.set(key, params, value);
    return value;
  }

  public export(): CacheInterface {
    return this._cache;
  }

  public import(cache: CacheInterface) {
    if (Object.keys(this._cache).length === 0) {
      this._cache = cache;
    }
  }

  private log(error: AxiosError): void {
    console.warn(error.message);
  }
}
