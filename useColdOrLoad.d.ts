import { StoreCacheInterface } from "./interfaces";
declare const useColdOrLoad: <T = any>(resource: StoreCacheInterface<T>, params?: any) => T;
export default useColdOrLoad;
