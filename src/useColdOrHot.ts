import {useEffect, useState} from 'react';
import {CacheInterface} from './store.service';

const useColdOrHot = <T = any>(resource: CacheInterface<T>): T => {
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
