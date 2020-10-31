import {useEffect, useState} from 'react';
import {StoreCacheInterface} from "./interfaces";
import clone from "clone";

const useColdOrHot = <T = any>(resource: StoreCacheInterface<T>, load = false, clear = false): T => {
    const [state, setState] = useState<T>(resource.cold());

    useEffect(() => {
        if (load && !resource.isLoaded()) {
            resource.load().subscribe({
                error: console.error
            })
        }

        const sub = resource.hot().subscribe((data: T) => setState(clone(data)));

        return () => {
            if (clear) {
                resource.clear();
            }
            sub.unsubscribe();
        }
    }, []);

    return state;
}

export default useColdOrHot;
