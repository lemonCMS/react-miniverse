import { CookieGetOptions } from "universal-cookie";
import { Request } from "express";
import { CookieSetOptions } from "universal-cookie/cjs/types";
import { CookiesServiceInterface, DataInterface } from "./interfaces";
export default class CookiesService implements CookiesServiceInterface {
    private cookies;
    constructor();
    withReq(req: Request): void;
    get(name: string, options?: CookieGetOptions | undefined): string;
    set(name: string, value: DataInterface, options?: CookieSetOptions): void;
    remove(name: string, options?: CookieSetOptions): void;
}
