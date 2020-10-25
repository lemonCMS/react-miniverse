import {useEffect, useState} from 'react';
import {StoreCacheInterface} from "./interfaces";
import clone from "clone";

const useColdOrLoad = <T = any>(resource: StoreCacheInterface<T>, params: any = {}): T => {
    const [state, setState] = useState<T>(resource.cold());

    useEffect(() => {
        const sub = resource.load().subscribe(
            (data: T) => {
                setState(clone(data));
            },
            (err) => console.error(err)
        );

        return () => {
            sub.unsubscribe();
        }
    }, [...Object.values(params), ...Object.keys(params)]);

    return state;
}

export default useColdOrLoad;
