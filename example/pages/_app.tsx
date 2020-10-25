import '../styles/globals.css'
import {ApiService, CookiesService, StoreService} from "react-miniverse";
import PlaceholderService from "../services/placeholder.service";
import React from 'react';
import {AppProvider} from "../Components/AppContext";

function initServices() {
    const cookiesService = new CookiesService();
    const apiService = new ApiService(cookiesService);
    const storeService = new StoreService();
    const placeholderService = new PlaceholderService(apiService, storeService);

    return {
        cookiesService,
        apiService,
        storeService,
        placeholderService
    }
}

let globalServices = initServices();


function MyApp({Component, pageProps, _store}: any) {

    if (typeof window !== 'undefined') {
        globalServices.storeService.import(_store);
    }

    return (
        <AppProvider value={{...globalServices}}>
            <Component {...pageProps} />
        </AppProvider>
    );
}

MyApp.getInitialProps = async ({Component, ctx}: any) => {

    const {req} = ctx;
    let services;
    if (req) {
        services = initServices();
        services.cookiesService.withReq(req);
        globalServices = services;
    } else {
        services = globalServices;
    }

    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps({...ctx, services});
    }

    let _store = {};
    await services.storeService.export().then((data) => _store = data);

    return {_store, pageProps};

}

export default MyApp
