import {useEffect, useState} from 'react';
import {StoreCacheInterface} from "./interfaces";

const useColdOrHot = <T = any>(resource: StoreCacheInterface<T>, load = false): T => {
    const [state, setState] = useState<T>(resource.cold());

    useEffect(() => {
        if (load && !resource.isLoaded()) {
            resource.load().subscribe(
                () => {},
                (err) => console.error
            )
        }

        const sub = resource.hot().subscribe((data: T) => setState(data));

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return state;
}

export default useColdOrHot;
