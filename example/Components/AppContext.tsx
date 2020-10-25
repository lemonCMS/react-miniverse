import * as React from 'react';
import {
    ApiServiceInterface,
    CookiesServiceInterface,
    StoreServiceInterface
} from "react-miniverse";
import PlaceholderService from "../services/placeholder.service";

export interface AppContextInterface {
    apiInstance: ApiServiceInterface;
    cookiesService: CookiesServiceInterface;
    storeService: StoreServiceInterface;
    placeholderService: PlaceholderService;

    [key: string]: any;
}

const AppContext = React.createContext<any>({});

export function withAppContext<T>(Component: React.ComponentType<T>) {
    return (props: any) => {
        return (<AppContext.Consumer>{(context) => (<Component context={context} {...props} />)}</AppContext.Consumer>);
    };
}

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
export default AppContext;

