import { StoreCacheInterface } from "./interfaces";
declare const useColdOrHot: <T = any>(resource: StoreCacheInterface<T>, load?: boolean, clear?: boolean) => T;
export default useColdOrHot;
