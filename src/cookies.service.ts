import Cookies, {CookieGetOptions} from "universal-cookie";
import {Request} from "express";
import {CookieSetOptions} from "universal-cookie/cjs/types";
import {CookiesServiceInterface, DataInterface} from "./interfaces";

export default class CookiesService implements CookiesServiceInterface {
  private cookies: Cookies;

  constructor() {
      this.cookies = new Cookies();
  }

  public withReq(req: Request): void {
      this.cookies = new Cookies(req.headers.cookie);
  }

  public get(name: string, options?: CookieGetOptions | undefined): string {
      return this.cookies.get(name, options);
  }

  public set(name: string, value: DataInterface, options?: CookieSetOptions): void {
      this.cookies.set(name, value, {path: '/', ...options});
  }

  public remove(name: string, options?: CookieSetOptions): void {
      this.cookies.remove(name, {path: '/', ...options})
  }
}
