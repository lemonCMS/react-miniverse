import {useEffect, useState} from 'react';
import {StoreCacheInterface} from "../index";

const useColdOrHot = <T = any>(resource: StoreCacheInterface<T>): T => {
    const [state, setState] = useState<T>(resource.cold());

    useEffect(() => {
        const sub = resource.hot().subscribe((data: T) => setState(data));

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return state;
}

export default useColdOrHot;
