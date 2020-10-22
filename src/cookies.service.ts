import Cookies, {CookieGetOptions} from "universal-cookie";
import {Request} from "express";
import {CookieSetOptions} from "universal-cookie/cjs/types";

export default class CookiesService {
  private cookies: Cookies;

  constructor() {
    this.cookies = new Cookies();
  }

  public withReq(req: Request) {
    this.cookies = new Cookies(req.headers.cookie);
  }

  public get(name: string, options?: CookieGetOptions | undefined): string {
    return this.cookies.get(name, options);
  }

  public set(name: string, value: any, options?: CookieSetOptions) {
    this.cookies.set(name, value, {path: '/', ...options});
  }

  public remove(name: string, options?: CookieSetOptions) {
    this.cookies.remove(name, {path: '/', ...options})
  }
}
