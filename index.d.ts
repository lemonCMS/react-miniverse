import {Observable, ReplaySubject} from "rxjs";
import StoreInterface from "./src/store.service";
import ApiBaseService from "./src/api.base.service";
import CookiesService from "./src/cookies.service";
import {useColdOrHot} from "./src";

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

declare module "react-miniverse" {
    export const StoreService: StoreInterface;
    export const ApiBaseService: ApiBaseService;
    export const CookiesService: CookiesService;
    export const useColdOrHot: useColdOrHot
}