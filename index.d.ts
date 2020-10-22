declare module "react-miniverse" {
    import {
        ApiServiceInterface,
        CookiesServiceInterface,
        StoreServiceInterface,
        UseColdOrHotInterface
    } from "./src";

    export const StoreService: StoreServiceInterface;
    export const ApiService: ApiServiceInterface;
    export const CookiesService: CookiesServiceInterface;
    export const useColdOrHot: UseColdOrHotInterface;

    export type {StoreServiceInterface};
    export type {CookiesServiceInterface}
    export type {DataInterface}
    export type {ApiServiceInterface}
    export type {NameSpaceInterface}
    export type {RequestOptionsInterface}
    export type {StoreCacheInterface}
    export type {UseColdOrHotInterface}
}
