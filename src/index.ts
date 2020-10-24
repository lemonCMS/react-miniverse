import ApiService from "./api.service";
import StoreService from "./store.service";
import CookiesService from "./cookies.service";
import useColdOrHot from "./useColdOrHot";
import useColdOrLoad from "./useColdOrLoad";
import {
    StoreServiceInterface,
    CookiesServiceInterface,
    DataInterface,
    ApiServiceInterface,
    NameSpaceInterface,
    RequestOptionsInterface,
    StoreCacheInterface,
    UseColdOrHotInterface,
    UseColdOrLoadInterface
} from "./interfaces";

export type {StoreServiceInterface};
export type {CookiesServiceInterface}
export type {DataInterface}
export type {ApiServiceInterface}
export type {NameSpaceInterface}
export type {RequestOptionsInterface}
export type {StoreCacheInterface}
export type {UseColdOrHotInterface}
export type {UseColdOrLoadInterface}

export {ApiService};
export {StoreService};
export {CookiesService};
export {useColdOrHot};
export {useColdOrLoad};
