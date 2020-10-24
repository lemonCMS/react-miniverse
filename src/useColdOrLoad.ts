import {useEffect, useState} from 'react';
import {StoreCacheInterface} from "./interfaces";

const useColdOrLoad = <T = any>(resource: StoreCacheInterface<T>, params: any = {}): T => {
    const [state, setState] = useState<T>(resource.cold());

    useEffect(() => {
        const sub = resource.load().subscribe(
            (data: T) => setState(data),
            (err) => console.error(err)
        );

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return state;
}

export default useColdOrLoad;
