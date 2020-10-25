import {useEffect, useState} from 'react';
import {ResourceObservableInterface, StoreCacheInterface} from "./interfaces";
import clone from "clone";

const useColdOrHot = <T = any>(resource: StoreCacheInterface<T>, load = false): T => {
    const [state, setState] = useState<T>(resource.cold());

    useEffect(() => {
        if (load && !resource.isLoaded()) {
            resource.load().subscribe(
                () => {
                },
                (err) => console.error
            )
        }

        const sub = resource.hot().subscribe((data: T) => setState(clone(data)));

        return () => {
            sub.unsubscribe();
        }
    }, []);

    return state;
}

export default useColdOrHot;
