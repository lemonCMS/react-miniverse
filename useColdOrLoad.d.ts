import { StoreCacheInterface } from "./interfaces";
declare const useColdOrLoad: <T = any>(resource: StoreCacheInterface<T>, params?: any, clear?: boolean) => T;
export default useColdOrLoad;
